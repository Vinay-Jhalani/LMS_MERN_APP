import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  useGenerateCertificateMutation,
  usePurchasedCourseLecturesQuery,
  useUpdateLectureProgressMutation,
} from "@/features/api/courseDashboardApi";
import { CheckCircle2, CirclePlay } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";

const CourseProgress = () => {
  const params = useParams();
  const courseId = params.courseId;
  console.log(courseId);

  const { data, isSuccess, isError, refetch } =
    usePurchasedCourseLecturesQuery(courseId);

  const [courseTitle, setCourseTitle] = useState();
  const [lectures, setLectures] = useState([]);
  const [activeLecture, setActiveLecture] = useState([]);
  const [activeLectureId, setActiveLectureId] = useState("");
  const [completedLectures, setCompletedLectures] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);

  const [
    updateLecture,
    { data: updateLectureData, isSuccess: updateLectureIsSuccess },
  ] = useUpdateLectureProgressMutation();

  const [getPdf, { data: pdfData, isSuccess: pdfIsSuccess }] =
    useGenerateCertificateMutation();

  useEffect(() => {
    updateLecture({ courseId });
  }, []);

  useEffect(() => {
    setCourseTitle(data?.course?.courseTitle);
    setLectures(data?.course?.lectures);
  }, [data]);

  useEffect(() => {
    if (updateLectureData?.progress?.lastViewed) {
      setActiveLectureId(updateLectureData?.progress?.lastViewed);
    }
    // if (!updateLectureData?.progress?.lastViewed) {
    // }

    if (updateLectureData?.progress?.lectureProgress) {
      setCompletedLectures(updateLectureData?.progress?.lectureProgress);
    }

    setIsCompleted(updateLectureData?.progress?.completed);
    console.log(updateLectureData);
  }, [updateLectureIsSuccess, lectures]);

  useEffect(() => {
    const initialLecture = lectures?.find(
      (lecture) => lecture._id === activeLectureId
    );
    const initialIndex = lectures?.findIndex(
      (lecture) => lecture._id === activeLectureId
    );

    setActiveLecture([initialLecture, initialIndex]);
  }, [activeLectureId, lectures]);

  async function updateLectureProgress(id, lecture, index) {
    // console.log(lecture);
    setActiveLecture([lecture, index]);
    setActiveLectureId(id);
    await updateLecture({
      courseId: courseId,
      currentLecture: id,
    });
  }

  async function getCertificate() {
    try {
      // Make a request to the backend to fetch the certificate PDF
      const response = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/v1/course-dashboard/getCertificate/${courseId}`,
        {
          withCredentials: true,
          responseType: "blob", // Ensure the response is handled as a blob (binary data)
        }
      );
      toast.success("Download Started");
      // Create a blob from the response data
      const blob = new Blob([response.data], { type: "application/pdf" });

      // Create a download link and trigger the download
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "certificate.pdf"; // Name the downloaded PDF file
      link.click();
    } catch (error) {
      console.error("Error downloading certificate:", error);
      toast.error("Something went wrong.");
    }
  }

  return (
    <>
      <div className="max-w-7xl mx-auto p-4 mt-20">
        {/* Display course name  */}
        <div className="flex justify-between mb-4">
          <h1 className="text-2xl font-bold">{courseTitle}</h1>
          <Button
            variant="outline"
            disabled={!isCompleted}
            onClick={() => getCertificate()}
          >
            Get Certificate
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-6 ">
          {/* Video section  */}
          <div className="flex-1 md:w-3/5 h-fit rounded-lg shadow-lg p-4 dark:bg-gray-800">
            <div>
              <video
                src={activeLecture[0]?.videoUrl?.replace("http://", "https://")}
                controls
                className="w-full h-auto max-h-[50vh]  md:rounded-lg object-contain"
              />
            </div>
            {/* Display current watching lecture title */}
            <div className="mt-2 ">
              <h3 className="font-medium text-lg">
                {activeLecture[0]?.lectureTitle &&
                  `LECTURE ${activeLecture[1] + 1} : ${
                    activeLecture[0]?.lectureTitle
                  }`}
              </h3>
            </div>
          </div>
          {/* Lecture Sidebar  */}
          <div className="flex flex-col w-full md:w-2/5 border-t md:border-t-0 md:border-l border-gray-200 md:pl-4 pt-4 md:pt-0">
            <h2 className="font-semibold text-xl mb-4">Course Lecture</h2>
            <div className="flex-1 overflow-y-auto">
              {lectures?.map((lecture, index) => (
                <Card
                  key={index}
                  className={`mb-3 hover:cursor-pointer transition transform  `}
                  onClick={() =>
                    updateLectureProgress(lecture?._id, lecture, index)
                  }

                  // onClick={() => setActiveLecture([lecture, index])}
                >
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center">
                      {completedLectures?.includes(lecture._id) ? (
                        <CheckCircle2
                          size={24}
                          className="text-green-500 mr-2"
                        />
                      ) : (
                        <CirclePlay size={24} className="text-gray-500 mr-2" />
                      )}
                      <div>
                        <CardTitle className="text-lg font-medium">
                          {lecture.lectureTitle}
                        </CardTitle>
                      </div>
                    </div>
                    {completedLectures?.includes(lecture._id) && (
                      <Badge
                        variant={"outline"}
                        className="bg-green-200 text-green-600"
                      >
                        Completed
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseProgress;
