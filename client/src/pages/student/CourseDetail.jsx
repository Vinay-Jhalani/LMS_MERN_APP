import BuyCourseButton from "@/components/BuyCourseButton";
import OverlayVideo from "@/components/OverlayVideo";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useGetCourseDetailWithStatusQuery } from "@/features/api/purchaseApi";
import { Lock, PlayCircle } from "lucide-react";
import { useState } from "react";
import ReactPlayer from "react-player";
import { useNavigate, useParams } from "react-router-dom";
import DOMPurify from "dompurify";

const CourseDetail = () => {
  const [isOverlayVideoVisible, setOverlayVideoVisible] = useState(false);
  const [overlayVideoUrl, setOverlayVideoUrl] = useState("");
  const params = useParams();
  const courseId = params.courseId;
  const navigate = useNavigate();
  const { data, isLoading, isError } =
    useGetCourseDetailWithStatusQuery(courseId);

  if (isLoading) return <h1>Loading...</h1>;
  if (isError) return <h>Failed to load course details</h>;

  const { course, purchased } = data;
  console.log(purchased);

  const handleContinueCourse = () => {
    if (purchased) {
      navigate(`/course-progress/${courseId}`);
    }
  };

  function overlayVideoHandler(videoUrl) {
    setOverlayVideoUrl(videoUrl);
    setOverlayVideoVisible((prev) => !prev);
  }

  return (
    <>
      <OverlayVideo
        visible={isOverlayVideoVisible}
        cross={setOverlayVideoVisible}
      >
        {overlayVideoUrl}
      </OverlayVideo>
      <div className=" space-y-5 mt-16 lg:relative">
        <div className="bg-[#EDFFE4] dark:bg-gray-700 text-black dark:text-gray-200">
          <div className="max-w-7xl mx-auto py-8 px-4 md:px-8 flex flex-col gap-2">
            <h1 className="font-bold text-2xl md:text-3xl">
              {course?.courseTitle}
            </h1>
            <p className="text-base md:text-lg md:max-w-[50%]">
              {course?.subTitle}
            </p>
            <p>
              🧠 Created By{" "}
              <span className="text-[purple] dark:text-pink-400 underline italic">
                {course?.creator.name}
              </span>
            </p>
            <div className="flex items-center gap-2 text-sm">
              🕒
              <p>Last updated {course?.createdAt.split("T")[0]}</p>
            </div>
            <p>🎓 Students enrolled: {course?.enrolledStudents.length}</p>
            <p>💪🏼Certificate of completion</p>
            <p>♥️Full lifetime access</p>
          </div>
        </div>
        <div className=" max-w-7xl mx-auto my-5 px-4 md:px-8 flex flex-col-reverse lg:flex-row justify-between gap-10">
          <div className="w-full lg:w-1/2 space-y-5 mb-10">
            <h1 className="font-bold text-xl md:text-2xl">Description</h1>
            <div className="text-sm dark:!text-white">
              <p
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(course.description, {
                    FORBID_ATTR: ["style"],
                  }),
                }}
              ></p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Course Content</CardTitle>
                <CardDescription>
                  {course?.lectures?.length} lectures
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {course.lectures.map((lecture, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm">
                    <span>
                      {lecture.isPreviewFree ? (
                        <PlayCircle
                          size={14}
                          className=" text-purple-600 dark:text-purple-400  transition-all"
                        />
                      ) : (
                        <Lock size={14} />
                      )}
                    </span>

                    {!lecture.isPreviewFree ? (
                      <p>{lecture.lectureTitle}</p>
                    ) : (
                      <p
                        onClick={() => overlayVideoHandler(lecture?.videoUrl)}
                        className="underline text-purple-600 dark:text-purple-400 hover:text-purple-500 hover:font-medium transition-all cursor-pointer"
                      >
                        {lecture.lectureTitle}
                      </p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
          <div className="w-full lg:w-1/3 ">
            <Card className="lg:top-[15vh]  w-fit lg:absolute">
              <CardContent className="p-4 flex flex-col lg:w-[30vw]">
                <div className=" h-[30%] aspect-video mb-4">
                  <ReactPlayer
                    width="100%"
                    height={"100%"}
                    className="object-contain"
                    url={course.lectures[0].videoUrl}
                    controls={true}
                  />
                </div>
                <h1 className="font-semibold">
                  {course.lectures[0].lectureTitle}
                </h1>
                <Separator className="mt-2" />
                <h1 className="text-lg md:text-xl font-semibold mt-2  ">
                  ₹ {course?.coursePrice}
                </h1>
              </CardContent>
              <CardFooter className="flex justify-center">
                {purchased ? (
                  <Button onClick={handleContinueCourse} className="w-full">
                    Continue Course
                  </Button>
                ) : (
                  <BuyCourseButton courseId={courseId} />
                )}
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseDetail;
