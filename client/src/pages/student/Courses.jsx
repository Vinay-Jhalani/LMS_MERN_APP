import CourseSkeleton from "@/components/CourseSkeleton";
import Course from "./Course";
import { useGetPublishedCoursesQuery } from "@/features/api/courseApi";

function Courses() {
  const { data, isLoading, isSuccess, isError } = useGetPublishedCoursesQuery();

  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 ">
        <h2 className="font-bold text-3xl text-center mb-10">Our Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading
            ? Array.from({ length: 8 }).map((_, index) => (
                <CourseSkeleton key={index} />
              ))
            : data.courses &&
              data?.courses.map((course, index) => (
                <Course key={index} course={course} />
              ))}
        </div>
      </div>
    </div>
  );
}

export default Courses;
