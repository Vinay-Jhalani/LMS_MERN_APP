import { useGetCourseDetailWithStatusQuery } from "@/features/api/purchaseApi";
import { Loader, Loader2 } from "lucide-react";
import { useSelector } from "react-redux";
import { Navigate, useParams } from "react-router-dom";

export const PurchaseProtectedRoute = ({ children }) => {
  const params = useParams();
  const courseId = params.courseId;
  const { data, isLoading } = useGetCourseDetailWithStatusQuery(courseId);

  if (isLoading)
    return (
      <div className="w-[100vw] h-[100vh] flex items-center justify-center">
        <Loader className="w-[15%] h-[15%] animate-spin text-[#fdce4d]" />
      </div>
    );

  return data?.purchased ? (
    children
  ) : (
    <Navigate to={`course-detail/${courseId}`} />
  );
};
