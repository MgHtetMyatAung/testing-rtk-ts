/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetchBaseQuery, retry, BaseQueryFn } from "@reduxjs/toolkit/query";
import { setErrorInfo } from "../redux/default_slices/errorSlice";
import type { RootState } from "../redux/store"; // Assuming you have a RootState type for Redux state
import { decryptToken } from "../libs/crypto";
import { systemLogout } from "../redux/default_slices/authSlice";
import { authApi } from "../services/endpoints/auth.api";

type BaseQueryArgs = Parameters<BaseQueryFn>;

// Custom retry logic using retry.fail for specific errors
const customBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_APP_BASE_URL,
  prepareHeaders: (headers, { getState, endpoint }) => {
    const state = getState() as RootState;
    const { accessToken: token, refreshToken } = state.auth;

    if (endpoint === "refreshToken" && refreshToken) {
      const decryptedRefreshToken = decryptToken(refreshToken);
      headers.set("Authorization", `Bearer ${decryptedRefreshToken}`);
    } else if (endpoint === "logout" && refreshToken) {
      const decryptedRefreshToken = decryptToken(refreshToken);
      headers.set("Authorization", `Bearer ${decryptedRefreshToken}`);
    } else if (token) {
      const decryptedToken = decryptToken(token);
      headers.set("Authorization", `Bearer ${decryptedToken}`);
    }

    return headers;
  },
});

const baseQuery = retry(
  async (args, api, extraOptions) => {
    const result = await customBaseQuery(args, api, extraOptions);

    // Prevent retry if it's a 4xx client-side error (invalid credentials or similar)
    if (
      result?.error &&
      typeof result.error.status === "number" &&
      result.error.status >= 400 &&
      result.error.status < 500
    ) {
      return retry.fail(result); // Stops retries for 4xx errors
    }

    return result;
  },
  {
    maxRetries: 5, // Retry for up to 5 attempts for network or server errors
  }
);

// const baseQuery = retry(
//   fetchBaseQuery({
//     baseUrl: import.meta.env.VITE_APP_BASE_URL,
//     prepareHeaders: (headers: Headers, { getState }) => {
//       const token = (getState() as RootState).auth.accessToken;

//       if (token) {
//         const decryptedToken = decryptToken(token);
//         headers.set("Authorization", `Bearer ${decryptedToken}`);
//       }
//       headers.set("Credentials", "include");
//       headers.set("Content-Type", "application/json");

//       return headers;
//     },
//   }),
//   {
//     maxRetries: 5,
//     retryCondition: (error: FetchBaseQueryError) => {
//       // Retry only if the error is a network or 5xx server error
//       return (
//         (typeof error.status === "number" && error.status >= 500) || // Server errors (5xx)
//         error.status === "FETCH_ERROR" // Network errors
//       );
//     },
//   }
// );

// // Function to refresh token
// const refreshAccessToken = async (api: any): Promise<string | null> => {
//   const refreshToken = api.getState().auth.refreshToken;

//   if (!refreshToken) {
//     // If there is no refresh token, log the user out
//     api.dispatch(systemLogout());
//     return null;
//   }

//   // Make a request to refresh the token
//   const refreshResult = await baseQuery(
//     {
//       url: "/auth/refresh",
//       method: "POST",
//       body: { refreshToken },
//     },
//     api,
//     {}
//   );

//   if (
//     refreshResult?.data &&
//     typeof refreshResult.data === "object" &&
//     "accessToken" in refreshResult.data
//   ) {
//     // Save the new access token
//     const newAccessToken = refreshResult.data.accessToken as string;
//     api.dispatch(setTokens({ accessToken: newAccessToken }));

//     return newAccessToken;
//   } else {
//     // If the refresh token is invalid, log the user out
//     api.dispatch(systemLogout());
//     return null;
//   }
// };

// Function to refresh the access token using the refreshToken mutation
const refreshAccessToken = async (api: any) => {
  const refreshToken = api.getState().auth.refreshToken;

  if (!refreshToken) {
    // If there is no refresh token, log the user out
    api.dispatch(systemLogout());
    return null;
  }

  // Call the refreshToken mutation using the authApi
  const refreshResult = await api.dispatch(
    authApi.endpoints.refreshToken.initiate({ refreshToken }) // No arguments needed if the body is void
  );

  console.log(refreshResult, "refreshResult");

  if (refreshResult?.data?.accessToken) {
    // Save the new access token
    const newAccessToken = refreshResult.data.accessToken;

    return newAccessToken;
  } else {
    // If the refresh token is invalid, log the user out
    api.dispatch(systemLogout());
    return null;
  }
};

export const baseQueryWithErrorHandling = async (
  args: BaseQueryArgs[0],
  api: BaseQueryArgs[1],
  extraOptions: BaseQueryArgs[2]
): Promise<any> => {
  let result = await baseQuery(args, api, extraOptions);
  console.log(result.error, "error");

  if (result.error) {
    const error = result.error as any;
    console.log(error);
    if (error.error.status === 401) {
      const newAccessToken = await refreshAccessToken(api);

      if (newAccessToken) {
        // Retry the original request with the new token
        args.headers = {
          ...args.headers,
          Authorization: `Bearer ${newAccessToken}`,
        };

        result = await baseQuery(args, api, extraOptions); // Retry the original request
      }
    }

    if (error.status === "FETCH_ERROR") {
      api.dispatch(
        setErrorInfo({
          type: "error",
          message: "Network error (Please try again)",
          status: 500,
        })
      );
    }
  }
  console.log(result);

  return result;
};
