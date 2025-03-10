import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import Lecture from "./Lecture";
import LectureTab from "./LectureTab";

function EditLecture() {
  const params = useParams();
  const courseId = params.courseId;
  return (
    <div className="mt-20 md:mt-1 max-w-[100vw]">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Link to={`/admin/course/${courseId}/lecture`}>
            <Button size="icon" variant="outline" className="rounded-full">
              <ArrowLeft size={16} />
            </Button>
          </Link>
          <h1 className="font-bold text-xl">Update Your Lecture</h1>
        </div>
      </div>
      <LectureTab />
    </div>
  );
}

export default EditLecture;
