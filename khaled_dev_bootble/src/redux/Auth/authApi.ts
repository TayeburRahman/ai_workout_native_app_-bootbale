import * as SecureStore from "expo-secure-store";
import { api } from "../baseApi";

import {
  LogOutResponse,
  ProfileResponse,
  SignInPayload,
  SignInResponse,
  SignUpPayload,
  SignUpResponse,
} from "../types/auth";
import { logoutUser, setCredentials } from "./authSlice";
import { getResponseToken, getResponseUser } from "@/src/utils/authRouting";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // ============== sign in
    signin: builder.mutation<SignInResponse, SignInPayload>({
      query: (credentials) => ({
        url: "auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth"],

      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;

          const token = getResponseToken(data);
          const user = getResponseUser(data);

          if (token) {
            await SecureStore.setItemAsync("token", token);
          }

          if (user && token) {
            dispatch(setCredentials({ user, token }));
          }
        } catch (e) {
          console.error("Login failed:", e);
        }
      },
    }),

    // ==================sign up
    signup: builder.mutation<SignUpResponse, SignUpPayload>({
      query: (credentials) => ({
        url: "auth/register",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth"],

      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        const { data } = await queryFulfilled;
        const token = getResponseToken(data);
        const user = getResponseUser(data);

        if (token) {
          await SecureStore.setItemAsync("token", token);
        }

        if (user && token) {
          dispatch(setCredentials({ user, token }));
        }
      },
    }),

    // =======================varification of data
    verifyCode: builder.mutation({
      query: (data) => ({
        url: "auth/verify-email",
        method: "POST",
        body: data,
      }),
    }),
    // ======================== resend validation
    otpresendValidation: builder.mutation({
      query: (data) => ({
        url: "auth/resend-otp",
        method: "POST",
        body: data,
      }),
    }),

    // ===========================resend forget otp
    otpresendForget: builder.mutation({
      query: (data) => ({
        url: "auth/resend-forgot-password-otp",
        method: "POST",
        body: data,
      }),
    }),

    // =========================profile data
    getMyProfile: builder.query<ProfileResponse, void>({
      query: () => ({
        url: "auth/me",
        method: "GET",
      }),
      providesTags: ["Auth"],
    }),

    // ============================forget password
    forgetPassword: builder.mutation({
      query: (data) => ({
        url: "auth/forgot-password",
        method: "POST",
        body: data,
      }),
    }),
    //========================reset password password
    resetPassword: builder.mutation({
      query: (data) => ({
        url: "auth/reset-password",
        method: "POST",
        body: data,
      }),
    }),

    // ===========================change email
    changeEmail: builder.mutation({
      query: (data) => ({
        url: "auth/change-email",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Auth"],

      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          const token = getResponseToken(data);
          const user = getResponseUser(data);

          if (token) {
            await SecureStore.setItemAsync("token", token);
          }

          if (user && token) {
            dispatch(setCredentials({ user, token }));
          }
        } catch (e) {
          console.error("Change email storage update failed:", e);
        }
      },
    }),

    // =========================log out
    logout: builder.mutation<LogOutResponse, void>({
      query: () => ({
        url: "auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["Auth", "Profile"],

      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;

          // Delete token (secure)
          await SecureStore.deleteItemAsync("token");
          await SecureStore.deleteItemAsync("user");

          // Clear Redux state
          dispatch(logoutUser());
        } catch (err) {
          console.log("Logout failed:", err);
        }
      },
    }),
  }),

  overrideExisting: false,
});

export const {
  useSigninMutation,
  useSignupMutation,
  useGetMyProfileQuery,
  useVerifyCodeMutation,
  useForgetPasswordMutation,
  useResetPasswordMutation,
  useLogoutMutation,
  useOtpresendForgetMutation,
  useOtpresendValidationMutation,
  useChangeEmailMutation,
  useLazyGetMyProfileQuery,
} = authApi;
