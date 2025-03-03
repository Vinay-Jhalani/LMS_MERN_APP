import RichTextEditor from "@/components/RichTextEditor";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useDeleteCourseMutation,
  useEditCourseMutation,
  useGetCourseByIdQuery,
  usePublishCourseMutation,
} from "@/features/api/courseApi";
import { toast } from "sonner";

function CourseTab() {
  const [input, setInput] = useState({
    courseTitle: "",
    subTitle: "",
    description: "",
    category: "",
    courseLevel: "",
    coursePrice: "",
    courseThumbnail: "",
  });
  const params = useParams();
  const courseId = params.courseId;

  const [previewThumbnail, setPreviewThumbnail] = useState("");

  const navigate = useNavigate();

  const {
    data: savedData,
    isLoading: savedDataIsLoading,
    isSuccess: isSuccessSavedData,
    refetch,
  } = useGetCourseByIdQuery({ courseId });

  const isPublished = savedData?.course?.isPublished;

  const [editCourse, { data, isLoading, isSuccess, error }] =
    useEditCourseMutation();

  const [
    publishCourse,
    {
      data: publishData,
      isSuccess: publishIsSucccess,
      isError: publishIsError,
      isLoading: publishIsLoading,
    },
  ] = usePublishCourseMutation();

  const [
    removeCourse,
    {
      isLoading: deleteIsLoading,
      isSuccess: deleteIsSuccess,
      isError: deleteIsError,
    },
  ] = useDeleteCourseMutation();

  useEffect(() => {
    if (isSuccessSavedData && savedData) {
      const course = savedData?.course;
      if (course) {
        console.log(course);
        for (let key in input) {
          if (course[key]) {
            setInput((prev) => {
              return { ...prev, [key]: course[key] };
            });
          }
        }
        // setInput({
        //   courseTitle: course.courseTitle,
        //   subTitle: course.subTitle,
        //   description: course.description,
        //   category: course.category,
        //   courseLevel: course.courseLevel,
        //   coursePrice: course.coursePrice,
        // });
        setPreviewThumbnail(course.courseThumbnail);
      }
    }
  }, [isSuccessSavedData, savedData]);

  function changeEventHandler(e) {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  }
  function selectCategory(value) {
    setInput({ ...input, category: value });
  }

  function selectCourseLevel(value) {
    setInput({ ...input, courseLevel: value });
  }

  function selectThumbnail(e) {
    const file = e.target.files?.[0];
    if (file) {
      setInput({ ...input, courseThumbnail: file });
      const fileReader = new FileReader();
      fileReader.onloadend = () => setPreviewThumbnail(fileReader.result);
      fileReader.readAsDataURL(file);
    }
  }

  async function updateCourseHandler() {
    console.log("Input object:", input);
    const formData = new FormData();
    formData.append("courseTitle", input.courseTitle);
    formData.append("subTitle", input.subTitle);
    formData.append("description", input.description);
    formData.append("category", input.category);
    formData.append("courseLevel", input.courseLevel);
    formData.append("coursePrice", input.coursePrice);
    formData.append("courseThumbnail", input.courseThumbnail);

    await editCourse({ formData, courseId });
  }

  async function deleteCourseHandler() {
    await removeCourse(courseId);
    navigate("/admin/course");
  }

  useEffect(() => {
    if (deleteIsSuccess) {
      toast.success("Course Deleted Successfully.");
    }
    if (deleteIsError) {
      toast.error("Internal Serval Error.");
    }
  }, [deleteIsError, deleteIsSuccess]);

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Course Updated");
      refetch();
    }
    if (error) {
      toast.error(error?.data?.message || "Failed to update course");
    }
  }, [isSuccess, error]);

  useEffect(() => {
    if (publishIsSucccess) {
      refetch();
      toast.success(publishData?.message || "Course Published");
    }
    if (publishIsError) {
      toast.error("Failure while changing status");
    }
  }, [publishIsSucccess, publishIsError]);

  if (savedDataIsLoading) return <Loader2 className="h-8 w-8 animate-spin" />;
  // return (
  //   <div className="flex h-[100vh] w-full items-center justify-center">
  //     <Loader2 className="animate-spin " />
  //   </div>
  // );

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between">
        <div>
          <CardTitle>Basic course information</CardTitle>
          <CardDescription>
            Make changes to your courses here. Click save when you are done.
          </CardDescription>
        </div>
        <div className="space-x-2">
          <span
            title={
              savedData?.course?.lectures.length === 0 &&
              "Empty course can't be published"
            }
          >
            <Button
              variant="outline"
              disabled={
                savedDataIsLoading ||
                publishIsLoading ||
                isLoading ||
                deleteIsLoading ||
                savedData?.course.lectures.length === 0
              }
              onClick={() => publishCourse(courseId)}
            >
              {savedDataIsLoading ||
              publishIsLoading ||
              isLoading ||
              deleteIsLoading ? (
                <>
                  <Loader2 className="animate-spin" /> Please wait
                </>
              ) : isPublished ? (
                "Unpublish " + "Course"
              ) : (
                "Publish " + "Course"
              )}
            </Button>
          </span>

          <Button
            variant="destructive"
            disabled={
              deleteIsLoading ||
              isLoading ||
              publishIsLoading ||
              savedDataIsLoading
            }
            onClick={() => deleteCourseHandler()}
          >
            Remove Course
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mt-5">
          <div>
            <Label>Title</Label>
            <Input
              type="text"
              name="courseTitle"
              placeholder="Ex. Web Development"
              value={input.courseTitle}
              onChange={changeEventHandler}
            />
          </div>
          <div>
            <Label>Subtitle</Label>
            <Input
              type="text"
              name="subTitle"
              placeholder="Ex. Become a Web Developer from zero to hero in 2 months"
              value={input.subTitle}
              onChange={changeEventHandler}
            />
          </div>
          <div>
            <Label>Description</Label>
            <RichTextEditor input={input} setInput={setInput} />
          </div>
          <div className="flex items-center gap-5 flex-wrap">
            <div>
              <Label>Category</Label>
              <Select onValueChange={selectCategory} value={input.category}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Categories</SelectLabel>
                    <SelectItem value="nextjs">Next JS</SelectItem>
                    <SelectItem value="datascience">Data Science</SelectItem>
                    <SelectItem value="fullstackdevelopment">
                      Fullstack Development
                    </SelectItem>
                    <SelectItem value="javascript">JavaScript</SelectItem>
                    <SelectItem value="python">Python</SelectItem>
                    <SelectItem value="webdevelopment">
                      Web Development
                    </SelectItem>
                    <SelectItem value="artificialintelligence">
                      Artificial Intelligence
                    </SelectItem>
                    <SelectItem value="cloudcomputing">
                      Cloud Computing
                    </SelectItem>
                    <SelectItem value="cybersecurity">Cybersecurity</SelectItem>
                    <SelectItem value="mobiledevelopment">
                      Mobile Development
                    </SelectItem>
                    <SelectItem value="react">React</SelectItem>
                    <SelectItem value="nodejs">Node.js</SelectItem>
                    <SelectItem value="devops">DevOps</SelectItem>
                    <SelectItem value="blockchain">Blockchain</SelectItem>
                    <SelectItem value="typescript">TypeScript</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Course Level</Label>
              <Select
                onValueChange={selectCourseLevel}
                value={input.courseLevel}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a course level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Course Level</SelectLabel>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Price in (INR)</Label>
              <Input
                type="number"
                name="coursePrice"
                value={input.coursePrice}
                onChange={changeEventHandler}
                placeholder="₹199"
              />
            </div>
          </div>
          <div>
            <Label>Course Thumbnail</Label>
            <Input
              type="file"
              onChange={selectThumbnail}
              accept="image/*"
              className="w-fit"
            />
            {previewThumbnail && (
              <img
                src={previewThumbnail}
                className="w-64 my-2 "
                alt="Course Thumbnail"
              />
            )}
          </div>
          <div className="flex gap-2">
            <Button
              className="h-auto"
              variant="outline"
              onClick={() => navigate("/admin/course")}
              disabled={
                deleteIsLoading ||
                isLoading ||
                publishIsLoading ||
                savedDataIsLoading
              }
            >
              Cancel
            </Button>
            <Button
              disabled={
                isLoading ||
                deleteIsLoading ||
                publishIsLoading ||
                savedDataIsLoading
              }
              onClick={updateCourseHandler}
            >
              {isLoading ? (
                <>
                  <Loader2 className=" animate-spin" />
                  Please Wait
                </>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default CourseTab;
