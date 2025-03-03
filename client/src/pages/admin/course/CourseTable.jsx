import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetCreatorCoursesQuery } from "@/features/api/courseApi";
import { Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";

function CourseTable() {
  const { data, isLoading } = useGetCreatorCoursesQuery();
  const navigate = useNavigate();
  return isLoading ? (
    <h1>Loading...</h1>
  ) : (
    <div className="mt-20 md:mt-1 ">
      <Button onClick={() => navigate("create")} className="mb-6">
        Create a new course
      </Button>
      <Table>
        <TableCaption>A list of your recent courses.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Title</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.courses.map((course) => (
            <TableRow key={course?._id}>
              <TableCell className="font-medium">
                {course?.coursePrice ? "₹" + course?.coursePrice : "NA"}
              </TableCell>
              <TableCell>
                <Badge>{course?.isPublished ? "Published" : "Private"}</Badge>
              </TableCell>
              <TableCell>{course?.courseTitle}</TableCell>
              <TableCell className="text-right">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => navigate(course?._id)}
                >
                  <Edit />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default CourseTable;
