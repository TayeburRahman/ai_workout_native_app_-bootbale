import { api } from "../baseApi";

export const homedataApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // the ratio of the sleep recovery and readiness
    getmyhealth: builder.query<any, void>({
      query: () => ({
        url: "dashboard/home",
        method: "GET",
      }),
      providesTags: ["Health"],
    }),

    // ========================================================nutration add modal
    getSearchFood: builder.query({
      query: (food: string) => ({
        url: `nutrition/foods/search?limit=20&q=${food}`,
        method: "GET",
      }),
      providesTags: ["Health"],
    }),

    getFoodDetails: builder.query({
      query: (id: string) => ({
        url: `nutrition/foods/${id}`,
        method: "GET",
      }),
      providesTags: ["Health"],
    }),

    postAddMeals: builder.mutation({
      query: (data) => ({
        url: `nutrition/meals`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Health"],
    }),

    postCustomAddMeals: builder.mutation({
      query: (data) => ({
        url: `nutrition/foods/custom`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Health"],
    }),

    getAiNutritionAdvice: builder.query<any, void>({
      query: () => ({
        url: `ai/nutrition-advice`,
        method: "GET",
      }),
      providesTags: ["Health"],
    }),

    //=========================================================== notification

    getNotification: builder.query<any, void>({
      query: () => `notifications`,
      providesTags: ["Notification"],
    }),

    getUnreadCountNotification: builder.query<any, void>({
      query: () => `notifications/unread/count`,
      providesTags: ["Notification"],
    }),

    getShowSingleNotification: builder.query<any, string>({
      query: (id) => `notifications/${id}`,
      providesTags: (result, error, id) => [{ type: "Notification", id }],
    }),

    patchReadAllNotification: builder.mutation<any, void>({
      query: () => ({
        url: "notifications/read-all",
        method: "PATCH",
      }),
      invalidatesTags: ["Notification"],
    }),

    patchSingleNotification: builder.mutation<any, string>({
      query: (id) => ({
        url: `notifications/${id}/read`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notification"],
    }),

    patchMarkNotification: builder.mutation<any, { notificationIds: string[] }>(
      {
        query: (data) => ({
          url: `notifications/read-many`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: ["Notification"],
      },
    ),

    deleteSingleNotification: builder.mutation<any, string>({
      query: (id) => ({
        url: `notifications/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notification"],
    }),

    deleteAllNotification: builder.mutation<any, void>({
      query: () => ({
        url: "notifications/read",
        method: "DELETE",
      }),
      invalidatesTags: ["Notification"],
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetmyhealthQuery,
  useGetNotificationQuery,
  useGetUnreadCountNotificationQuery,
  useGetShowSingleNotificationQuery,
  usePatchMarkNotificationMutation,
  usePatchReadAllNotificationMutation,
  usePatchSingleNotificationMutation,
  useDeleteAllNotificationMutation,
  useDeleteSingleNotificationMutation,
  // the meel
  useGetFoodDetailsQuery,
  useGetSearchFoodQuery,
  usePostAddMealsMutation,
  usePostCustomAddMealsMutation,
  useGetAiNutritionAdviceQuery,
} = homedataApi;
