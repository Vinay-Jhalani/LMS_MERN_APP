import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import CourseTab from "./CourseTab";
import { ArrowLeft } from "lucide-react";

function EditCourse() {
  const navigate = useNavigate();
  return (
    <div className="flex-1 mt-20 md:mt-1 max-w-[100vw]">
      <Link to={`/admin/course/`}>
        <Button size="icon" variant="outline" className="rounded-full mb-2">
          <ArrowLeft size={16} />
        </Button>
      </Link>
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
