import { createApi, BaseQueryFn } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "./baseQuery";
import { revalidate } from "../services/revalidate";

// Assuming 'revalidate' is an object where the values are strings (or another specific type).
// If 'revalidate' contains different types, adjust the type accordingly.

export const baseApi = createApi({
  reducerPath: "base",
  baseQuery: baseQueryWithErrorHandling as BaseQueryFn,
  tagTypes: Object.values(revalidate) as string[], // Cast to string[] to match the expected type for tagTypes
  endpoints: () => ({}), // No specific endpoints defined here yet, type it when you add actual endpoints
});
