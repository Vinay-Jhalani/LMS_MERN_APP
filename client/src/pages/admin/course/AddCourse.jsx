import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateCourseMutation } from "@/features/api/courseApi";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

function AddCourse() {
  const [courseTitle, setCourseTitle] = useState("");
  const [category, setCategory] = useState("");

  const [createCourse, { data, isLoading, error, isSuccess, isError }] =
    useCreateCourseMutation();

  const navigate = useNavigate();

  const getSelectedCategory = (value) => {
    setCategory(value);
  };
  const createCourseHandler = async () => {
    await createCourse({ courseTitle, category });
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Course created.");
      navigate("/admin/course");
    }
    if (isError) {
      toast.error(error?.data?.message || "Error in Creating Course");
    }
  }, [isError, error, isSuccess]);

  return (
    <div className="flex-1 mx-10">
      <div className="mb-4">
        <h1 className="font-bold text-xl">
          Please, tell us more about your course and add necessary details
        </h1>
        <p className="text-sm">
          Tip: Users like simple and promising titles more
        </p>
      </div>
      <div className="space-y-4">
        <div>
          <Label>Title</Label>
          <Input
            type="text"
            value={courseTitle}
            placeholder="Your Course Name"
            onChange={(e) => setCourseTitle(e.target.value)}
          />
        </div>
        <div>
          <Label>Category</Label>
          <Select onValueChange={getSelectedCategory}>
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
                <SelectItem value="webdevelopment">Web Development</SelectItem>
                <SelectItem value="artificialintelligence">
                  Artificial Intelligence
                </SelectItem>
                <SelectItem value="cloudcomputing">Cloud Computing</SelectItem>
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
        <div className=" flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Back
          </Button>
          <Button disabled={isLoading} onClick={() => createCourseHandler()}>
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
      </div>
    </div>
  );
}

export default AddCourse;
