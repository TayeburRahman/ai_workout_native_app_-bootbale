import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import * as SecureStore from "expo-secure-store";

const BASE_URL = "http://10.10.28.71:5008/api/";
// const BASE_URL = "https://apiv2.bootble.com/api/";

// "http://10.10.20.17:5000/api/";
// ------------------------------
// Get token helper
// ------------------------------
const getToken = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync("token");
  } catch (error) {
    console.log("Error reading token:", error);
    return null;
  }
};

// ------------------------------
// Base baseQuery
// ------------------------------
const rawBaseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers) => {
    headers.set("Content-Type", "application/json");
    return headers;
  },
});

// ------------------------------
// Wrapper baseQuery that injects token
// ------------------------------
const baseQueryWithAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const token = await getToken();

  let newArgs: FetchArgs =
    typeof args === "string" ? { url: args } : { ...args };

  // Ensure headers exists as object
  newArgs.headers = {
    ...(newArgs.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  return rawBaseQuery(newArgs, api, extraOptions);
};

// ------------------------------
// API Slice
// ------------------------------
export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithAuth,

  tagTypes: [
    "Auth",
    "Health",
    "Select",
    "Profile",
    "User",
    "Notification",
    "Workouts",
    "meditation",
    "Wellness",
    "Nutrition",
  ],

  endpoints: () => ({}),
});
