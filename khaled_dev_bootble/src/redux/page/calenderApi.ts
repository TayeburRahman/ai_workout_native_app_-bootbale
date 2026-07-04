import { api } from "../baseApi";

export const calenderApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // /calendar/day?date=2026-02-17&filter=all
    getCalender: builder.query({
      query: ({
        datefilter,
        filter,
      }: {
        datefilter: string;
        filter: string;
      }) => ({
        url: `calendar/day?date=${datefilter}&filter=${filter}`,
        method: "GET",
      }),
      providesTags: ["Workouts"],
    }),

    rescheduleEvent: builder.mutation({
      query: (data: { eventType: string; eventId: string; newTime: string; date?: string }) => ({
        url: "calendar/reschedule",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Workouts"],
    }),

    updateSchedule: builder.mutation({
      query: (data: { date: string; dayType: string; shiftStart?: string; shiftEnd?: string; notes?: string }) => ({
        url: "calendar/schedule",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Workouts"],
    }),

    completeEvent: builder.mutation({
      query: (data: { eventType: string; eventId: string; date?: string; time?: string }) => ({
        url: "calendar/complete",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Workouts"],
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetCalenderQuery,
  useRescheduleEventMutation,
  useUpdateScheduleMutation,
  useCompleteEventMutation,
} = calenderApi;
