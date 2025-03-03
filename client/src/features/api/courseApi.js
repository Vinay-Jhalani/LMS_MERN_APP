import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const COURSE_API = "http://localhost:8080/api/v1/course";

export const courseApi = createApi({
  reducerPath: "courseApi",
  tagTypes: [
    "refetchCreatorCourse",
    "refetchLectures",
    "lectureUpdated",
    "newLecture",
  ],
  baseQuery: fetchBaseQuery({
    baseUrl: COURSE_API,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    createCourse: builder.mutation({
      query: ({ courseTitle, category }) => ({
        url: "",
        method: "POST",
        body: { courseTitle, category },
      }),
      invalidatesTags: ["refetchCreatorCourse"],
    }),
    getPublishedCourses: builder.query({
      query: () => ({
        url: "/getPubCourses",
        method: "GET",
      }),
    }),
    getCreatorCourses: builder.query({
      query: () => ({
        url: "",
        method: "GET",
      }),
      providesTags: ["refetchCreatorCourse"],
    }),
    editCourse: builder.mutation({
      query: ({ formData, courseId }) => ({
        url: `/${courseId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["refetchCreatorCourse"],
    }),
    getCourseById: builder.query({
      query: ({ courseId }) => ({
        url: `/${courseId}`,
        method: "GET",
      }),
      providesTags: ["newLecture"],
    }),
    createLecture: builder.mutation({
      query: ({ lectureTitle, courseId }) => ({
        url: `/${courseId}/lecture`,
        method: "POST",
        body: { lectureTitle },
      }),
      invalidatesTags: ["newLecture"],
    }),
    getCourseLectures: builder.query({
      query: (courseId) => ({
        url: `/${courseId}/lecture`,
        method: "GET",
      }),
      providesTags: ["refetchLectures"],
    }),
    editLecture: builder.mutation({
      query: ({
        lectureTitle,
        videoInfo,
        isPreviewFree,
        courseId,
        lectureId,
      }) => ({
        url: `/${courseId}/lecture/${lectureId}`,
        method: "POST",
        body: { lectureTitle, videoInfo, isPreviewFree },
      }),
      invalidatesTags: ["lectureUpdated"],
    }),
    removeLecture: builder.mutation({
      query: ({ courseId, lectureId }) => ({
        url: `/${courseId}/lecture/${lectureId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["refetchLectures", "newLecture"],
    }),
    getLectureById: builder.query({
      query: ({ courseId, lectureId }) => ({
        url: `/${courseId}/lecture/${lectureId}`,
        method: "GET",
      }),
      providesTags: ["lectureUpdated"],
    }),
    publishCourse: builder.mutation({
      query: (courseId) => ({
        url: `/${courseId}`,
        method: "PATCH",
      }),
    }),
    getSearchCourse: builder.query({
      query: ({ searchQuery, categories, sortByPrice }) => {
        let queryString = `/search?query=${encodeURIComponent(searchQuery)}`;
        //for categories
        if (categories && categories.length > 0) {
          const categoriesString = categories.map(encodeURIComponent).join(",");
          queryString += `&categories=${categoriesString}`;
        }
        //for sort by price
        if (sortByPrice) {
          queryString += `&sortByPrice=${encodeURIComponent(sortByPrice)}`;
        }
        return {
          url: queryString,
          method: "GET",
        };
      },
    }),
    deleteCourse: builder.mutation({
      query: (courseId) => ({
        url: `/deleteCourse/${courseId}`,
        method: "POST",
      }),
      invalidatesTags: ["refetchCreatorCourse", "refetchLectures"],
    }),
  }),
});

export const {
  useCreateCourseMutation,
  useGetPublishedCoursesQuery,
  useGetCreatorCoursesQuery,
  useEditCourseMutation,
  useGetCourseByIdQuery,
  useCreateLectureMutation,
  useGetCourseLecturesQuery,
  useEditLectureMutation,
  useRemoveLectureMutation,
  useGetLectureByIdQuery,
  usePublishCourseMutation,
  useGetSearchCourseQuery,
  useDeleteCourseMutation,
} = courseApi;
