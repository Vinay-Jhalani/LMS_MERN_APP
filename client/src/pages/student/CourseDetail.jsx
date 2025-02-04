// import { Button } from "@/components/ui/button";
// import { ShoppingCart } from "lucide-react";

// function CourseDetail() {
//   return (
//     <div className="mt-28 h-[full] w-full  ">
//       <div className="mt-10 pt-6 pb-6 bg-[#EDFFE4] w-full min-h-64 flex justify-center items-start ">
//         <div className="w-[60%] mr-24 pl-[15%] ">
//           <div className="flex  justify-start">
//             <h1 className="text-3xl ">
//               Build & Deploy The Best Ecommerce Website Ever Next.js 2025
//             </h1>
//           </div>
//           <div className="flex  justify-start mt-3 items-center">
//             <h3 className="text-lg opacity-85 ">
//               Master Next.js: Build & Deploy a Multi-Vendor E-Commerce Platform
//               (2025) - Next.js, TypeScript, MySQL, Prisma, Clerk...
//             </h3>
//           </div>
//           <div className="flex flex-col w-full justify-end items-start mt-3 text-lg opacity-75">
//             <p>🎓Enrolled Students : 206 </p>
//             <p>
//               🧠Created by :{" "}
//               <span className="text-[#084311] font-medium underline hover:cursor-pointer">
//                 Vinay Jhalani
//               </span>
//             </p>
//             <p>💪🏼Certificate of completion </p>
//             <p>♥️Full lifetime access </p>
//             <p>🕒Last updated 01/2025 </p>
//           </div>
//         </div>
//         <div className="w-[40%] flex-col justify-end pt-4 pb-4 ">
//           <video
//             controls
//             muted
//             className=" mr-36 w-96 h-60 object-contain shadow-lg"
//             src="https://res.cloudinary.com/dorniruzd/video/upload/v1736761315/ne998s0par1fv4ibyq2y.mp4"
//           ></video>
//           <div className="flex justify-center mt-2 w-96">
//             <Button className="w-48 text-xl bg-purple-700 hover:bg-purple-500">
//               Buy Now{<ShoppingCart />}
//             </Button>
//           </div>
//         </div>
//       </div>
//       <div className="flex justify-center">
//         <div className="pr-60 pl-60">
//           <h1 className="font-bold text-xl md:text-2xl mt-3 mb-3">
//             DESCRIPTION
//           </h1>
//           <p
//             className="text-sm"
//             // dangerouslySetInnerHTML={{ __html: course.description }}
//           />
//           <p className="text-sm ">
//             Lorem ipsum odor amet, consectetuer adipiscing elit. Dignissim
//             lobortis aliquam penatibus dolor maximus condimentum. Blandit
//             maecenas maximus in ipsum; nisl sit aptent. Fusce diam ipsum
//             consequat eget torquent eleifend fringilla. Sed aliquet id duis
//             proin fermentum; dapibus a. Volutpat per curae sagittis consectetur
//             cras taciti. Neque potenti at eleifend sed viverra eros suscipit
//             litora. Dis varius elementum penatibus porttitor ridiculus aliquam.
//             Eu ipsum fermentum; ac fringilla aliquet lacinia lacus. Fringilla
//             nec aenean; eros habitasse velit feugiat. Semper rutrum leo erat
//             lacinia hendrerit maecenas. Non libero rutrum tortor urna; torquent
//             nibh himenaeos dignissim. Diam torquent a pretium ligula sapien.
//             Tempor vehicula eleifend justo pretium eleifend fames tempus magnis.
//             Nulla sodales magnis rutrum class velit enim; vivamus dolor
//             elementum.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default CourseDetail;

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
import { Lock, PlayCircle, XIcon } from "lucide-react";
import { useState } from "react";
import ReactPlayer from "react-player";
import { useNavigate, useParams } from "react-router-dom";

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
      <div className="space-y-5 mt-24">
        <div className="bg-[#EDFFE4] text-black">
          <div className="max-w-7xl mx-auto py-8 px-4 md:px-8 flex flex-col gap-2">
            <h1 className="font-bold text-2xl md:text-3xl">
              {course?.courseTitle}
            </h1>
            <p className="text-base md:text-lg md:max-w-[50%]">
              {course?.subTitle}
            </p>
            <p>
              🧠 Created By{" "}
              <span className="text-[purple] underline italic">
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
        <div className="max-w-7xl mx-auto my-5 px-4 md:px-8 flex flex-col-reverse lg:flex-row justify-between gap-10">
          <div className="w-full lg:w-1/2 space-y-5">
            <h1 className="font-bold text-xl md:text-2xl">Description</h1>
            <p
              className="text-sm"
              dangerouslySetInnerHTML={{ __html: course.description }}
            />
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
                          className=" text-purple-600  transition-all"
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
                        className="underline text-purple-600 hover:text-purple-500 hover:font-medium transition-all cursor-pointer"
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
            <Card>
              <CardContent className="p-4 flex flex-col">
                <div className="w-96 max-w-[80vw] h-48 aspect-video mb-4">
                  <ReactPlayer
                    width="100%"
                    height={"100%"}
                    className="object-contain"
                    url={course.lectures[0].videoUrl}
                    controls={true}
                  />
                </div>
                <h1>{course.lectures[0].lectureTitle}</h1>
                <Separator className="my-2" />
                <h1 className="text-lg md:text-xl font-semibold">
                  ₹ {course?.coursePrice}
                </h1>
              </CardContent>
              <CardFooter className="flex justify-center p-4">
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
