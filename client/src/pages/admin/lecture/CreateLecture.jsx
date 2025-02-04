import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useCreateLectureMutation,
  useGetCourseLecturesQuery,
} from "@/features/api/courseApi";

import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import Lecture from "./Lecture";

function CreateLecture() {
  const [lectureTitle, setLectureTitle] = useState("");
  const navigate = useNavigate();
  const params = useParams();
  const courseId = params.courseId;
  const [createLecture, { data, isLoading, isSuccess, error }] =
    useCreateLectureMutation();

  const {
    data: lectureData,
    isLoading: isLoadingLectureData,
    isError,
    refetch,
  } = useGetCourseLecturesQuery(courseId);

  async function createLectureHandler() {
    // console.log(lectureTitle);
    await createLecture({ lectureTitle, courseId });
  }

  useEffect(() => {
    if (isSuccess) {
      toast.success(data.message);
      refetch();
    }
    if (error) {
      toast.error(error.data.message);
    }
  }, [isSuccess, error]);

  console.log(lectureData);

  return (
    <div className="flex-1 mx-10">
      <div className="mb-4">
        <h1 className="font-bold text-xl">
          Awesome, you&apos;re here! Ready to add lectures to your course? 🚀{" "}
        </h1>
        <p className="text-sm">
          Tip: Make lecture titles related to lecture for easy navigation of
          students.
        </p>
      </div>
      <div className="space-y-4">
        <div>
          <Label>Title</Label>
          <Input
            type="text"
            value={lectureTitle}
            onChange={(e) => setLectureTitle(e.target.value)}
            placeholder="Lecture Title"
          />
        </div>
        <div className=" flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/admin/course/${courseId}`)}
          >
            Back to course
          </Button>
          <Button disabled={isLoading} onClick={createLectureHandler}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Create"
            )}
          </Button>
        </div>
        <div className="mt-10">
          {isLoadingLectureData ? (
            <Loader2 className="animate-spin" />
          ) : isError ? (
            <p>Failure in loading lectures..</p>
          ) : lectureData.lectures.length === 0 ? (
            <p>No lecture available</p>
          ) : (
            lectureData.lectures.map((lecture, index) => (
              <Lecture
                key={lecture._id}
                lecture={lecture}
                courseId={courseId}
                index={index}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default CreateLecture;
