import { api } from "../baseApi";
export const aiApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAiSuggestions: builder.query({
      query: () => ({
        url: "ai/suggestions?context=dashboard",
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    getSleepTips: builder.query({
      query: () => ({
        url: "ai/sleep-tips",
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    getWorkoutPlan: builder.query({
      query: ({ goal, period }: { goal: string; period: string }) => ({
        url: `ai/workout-plan?goal=${goal}&duration=${period}`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    getNutrition: builder.query({
      query: () => ({
        url: "ai/nutrition-advice",
        method: "GET",
      }),
      providesTags: ["User", "Health"],
    }),

    getProgressInsights: builder.query({
      query: () => ({
        url: "ai/progress-insights",
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    sendMessage: builder.mutation({
      query: (data) => ({
        url: "ai/chat",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAiSuggestionsQuery,
  useGetSleepTipsQuery,
  useSendMessageMutation,
  useGetWorkoutPlanQuery,
  useGetNutritionQuery,
  useGetProgressInsightsQuery,
} = aiApi;
