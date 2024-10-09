import { createSlice } from "@reduxjs/toolkit";
import { encryptToken } from "../../libs/crypto";
import { authApi } from "../../services/endpoints/auth.api";

// Define the shape of the initial state
interface AuthState {
  accessToken: string | null;
  refreshToken?: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    systemLogout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, action) => {
        if (action.payload) {
          state.accessToken = encryptToken(action.payload.accessToken);
          state.refreshToken = encryptToken(action.payload.refreshToken);
          state.isAuthenticated = !!action.payload.accessToken;
        }
      }
    );
    builder.addMatcher(
      authApi.endpoints.refreshToken.matchFulfilled,
      (state, action) => {
        if (action.payload) {
          state.accessToken = encryptToken(action.payload.accessToken);
          state.isAuthenticated = !!action.payload.accessToken;
        }
      }
    );
  },
});

export const { systemLogout } = authSlice.actions;

export default authSlice.reducer;
