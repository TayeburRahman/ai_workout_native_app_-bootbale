import { api } from "../baseApi";
import {
  SubcriptionRequest,
  SubcritionResponse,
  SubscriptionResponse,
} from "../types/subcription";

export const subcriptionApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSubcriptionPlan: builder.query<SubscriptionResponse, void>({
      query: () => ({
        url: "subscriptions/plans",
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    subcriptionPayment: builder.mutation<
      SubcritionResponse,
      SubcriptionRequest
    >({
      query: (data) => ({
        url: "subscriptions/checkout",
        method: "POST",
        body: data,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetSubcriptionPlanQuery, useSubcriptionPaymentMutation } =
  subcriptionApi;
