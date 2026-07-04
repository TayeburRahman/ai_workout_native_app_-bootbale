import { api } from "../baseApi";

export const selectApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // shift select
    shiftselect: builder.mutation({
      query: (data) => ({
        url: "onboarding/shift",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Select"],
    }),

    // goal select
    goalselect: builder.mutation({
      query: (data) => ({
        url: "onboarding/goal",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Select"],
    }),
  }),
});

export const { useShiftselectMutation, useGoalselectMutation } = selectApi;
