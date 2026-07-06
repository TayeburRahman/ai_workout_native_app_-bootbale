import { api } from "../baseApi";

export const sleepRecoveryApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // /sleep-recovery/activities
    getSleepRecovery: builder.query<any, void>({
      query: () => ({
        url: "sleep-recovery/activities",
        method: "GET",
      }),
      providesTags: ["Workouts"],
    }),
    postSleepRecovery: builder.mutation({
      query: (data) => ({
        url: "sleep-recovery/log",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Workouts"],
    }),
    getSleepTips: builder.query<any, void>({
      query: () => ({
        url: "ai/sleep-tips",
        method: "GET",
      }),
      providesTags: ["Workouts"],
    }),
  }),

  overrideExisting: true,
});

export const { useGetSleepRecoveryQuery, usePostSleepRecoveryMutation, useGetSleepTipsQuery } =
  sleepRecoveryApi;
