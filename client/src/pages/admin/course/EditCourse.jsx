import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import CourseTab from "./CourseTab";

function EditCourse() {
  const navigate = useNavigate();
  return (
    <div className="flex-1">
      <div className="flex items-center justify-between mb-5">
        <h1 className="font-bold">Add detail information regarding course</h1>
        <Button
          className="hover:text-blue-600"
          variant="outline"
          onClick={() => navigate("lecture")}
        >
          Go to lecture page
        </Button>
      </div>
      <CourseTab />
    </div>
  );
}

export default EditCourse;
