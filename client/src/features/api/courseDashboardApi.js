import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const COURSE_PURCHASE_API = "http://localhost:8080/api/v1/course-dashboard";

export const courseDashboardApi = createApi({
  reducerPath: "courseDashboardApi",
  baseQuery: fetchBaseQuery({
    baseUrl: COURSE_PURCHASE_API,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    purchasedCourseLectures: builder.query({
      query: (courseId) => ({
        url: `/course/${courseId}`,
        method: "GET",
      }),
    }),
    updateLectureProgress: builder.mutation({
      query: ({ courseId, currentLecture, completed }) => ({
        url: `/${courseId}/update-details`,
        method: "POST",
        body: { currentLecture, completed },
      }),
    }),
    generateCertificate: builder.mutation({
      query: (courseId) => ({
        url: `getCertificate/${courseId}`,
        method: "POST",
      }),
    }),
  }),
});

export const {
  usePurchasedCourseLecturesQuery,
  useUpdateLectureProgressMutation,
  useGenerateCertificateMutation,
} = courseDashboardApi;
