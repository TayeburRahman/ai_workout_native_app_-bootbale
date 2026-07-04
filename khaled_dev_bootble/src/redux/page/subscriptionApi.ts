import { api } from "../baseApi";

export const subscriptionApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // /calendar/day?date=2026-02-17&filter=all
    getSubcription: builder.query({
      query: () => ({
        url: "subscriptions/plans",
        method: "GET",
      }),
      providesTags: ["Profile"],
    }),
  }),

  overrideExisting: false,
});

export const { useGetSubcriptionQuery } = subscriptionApi;
