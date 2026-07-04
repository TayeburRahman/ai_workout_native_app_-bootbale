import { api } from "../baseApi";

export const profiledataApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // get profile data
    getProfileData: builder.query<any, void>({
      query: () => ({
        url: `users/profile`,
        method: "GET",
      }),
      providesTags: ["Auth"],
    }),

    updateUserProfile: builder.mutation({
      query: (data) => ({
        url: `users/profile`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),

    // image post and update
    updateUserProfileImage: builder.mutation({
      query: (formData: FormData) => ({
        url: "users/profile-photo",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Auth"],
    }),
    // support and contract
    postSupportAndContract: builder.mutation({
      query: (data) => ({
        url: `contact-support`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Profile"],
    }),

    // tearm and policy
    getTearm: builder.query<any, void>({
      query: () => ({
        url: `content/terms`,
        method: "GET",
      }),
      providesTags: ["Profile"],
    }),

    getPolicy: builder.query<any, void>({
      query: () => ({
        url: `content/privacy`,
        method: "GET",
        responseHandler: async (response) => response.text(), //
      }),
      providesTags: ["Profile"],
    }),
    // faq
    getFaq: builder.query<any, void>({
      query: () => ({
        url: `content/faq`,
        method: "GET",
      }),
      providesTags: ["Profile"],
    }),
  }),
});
export const {
  useGetProfileDataQuery,
  useUpdateUserProfileMutation,
  useUpdateUserProfileImageMutation,
  usePostSupportAndContractMutation,
  useGetTearmQuery,
  useGetFaqQuery,
  useGetPolicyQuery,
} = profiledataApi;
