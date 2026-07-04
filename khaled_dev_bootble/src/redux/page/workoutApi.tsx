import { api } from "../baseApi";

export const workoutApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // =================================
    // create workout
    // =================================
    createWorkout: builder.mutation({
      query: (formData: FormData) => ({
        url: "workouts",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Workouts"],
    }),
    // =================================
    // get workout /workouts
    // =================================
    getWorkouts: builder.query<any, void>({
      query: () => ({
        url: "workouts",
        method: "GET",
      }),
      providesTags: ["Workouts"],
    }),
    // =================================
    // get workout by id /workouts/:id
    // =================================
    getWorkoutById: builder.query({
      query: (id: string) => ({
        url: `workouts/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Workouts", id }],
    }),
    // =================================
    ///workouts/log
    // =================================
    postWorkoutcompletion: builder.mutation({
      query: (data) => ({
        url: "workouts/log",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Workouts"],
    }),
  }),

  overrideExisting: false,
});

export const {
  useCreateWorkoutMutation,
  useGetWorkoutsQuery,
  useGetWorkoutByIdQuery,
  usePostWorkoutcompletionMutation,
} = workoutApi;
