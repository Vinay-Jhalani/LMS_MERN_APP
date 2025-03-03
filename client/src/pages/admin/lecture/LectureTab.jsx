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
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import {
  useEditLectureMutation,
  useGetLectureByIdQuery,
  useRemoveLectureMutation,
} from "@/features/api/courseApi";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const MEDIA_API = "http://localhost:8080/api/v1/media";

function LectureTab() {
  const [lectureTitle, setLectureTitle] = useState("");
  const [uploadVideoInfo, setUploadVideoInfo] = useState(null);
  const [isFree, setIsFree] = useState(false);
  const [mediaProgress, setMediaProgress] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewVideoUrl, setPreviewVideoUrl] = useState("");
  const [btnDisable, setBtnDisable] = useState(false);

  const params = useParams();
  const { courseId, lectureId } = params;
  const navigate = useNavigate();

  const { data: lectureData, error: lectureError } = useGetLectureByIdQuery({
    courseId,
    lectureId,
  });

  useEffect(() => {
    if (lectureData) {
      console.log(lectureData);
      lectureData.lecture.lectureTitle &&
        setLectureTitle(lectureData.lecture.lectureTitle);
      lectureData.lecture.isPreviewFree &&
        setIsFree(lectureData.lecture.isPreviewFree);
      lectureData.lecture.videoUrl &&
        setPreviewVideoUrl(lectureData.lecture.videoUrl);
    }
    if (lectureError) {
      toast.error(lectureError.data.message);
    }
  }, [lectureData, lectureError]);

  const [editLecture, { data, isLoading, error, isSuccess }] =
    useEditLectureMutation();

  const [
    removeLecture,
    {
      data: removingData,
      isLoading: removingIsLoading,
      isSuccess: removingIsSuccess,
      error: removingError,
    },
  ] = useRemoveLectureMutation();

  const fileChangeHandler = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      setMediaProgress(true);
      try {
        setBtnDisable(true);
        const res = await axios.post(`${MEDIA_API}/upload-video`, formData, {
          withCredentials: true,
          onUploadProgress: ({ loaded, total }) => {
            setUploadProgress(Math.round((loaded * 100) / total));
          },
        });

        if (res.data.success) {
          setUploadVideoInfo({
            videoUrl: res.data.data.url,
            publicId: res.data.data.public_id,
          });
          toast.success(res.data.message);
        }
      } catch (error) {
        toast.error("Something is wrong.");
        console.log(error);
      } finally {
        setMediaProgress(false);
        setBtnDisable(false);
      }
    }
  };

  async function editLectureHandler() {
    await editLecture({
      lectureTitle,
      videoInfo: uploadVideoInfo,
      isPreviewFree: isFree,
      courseId,
      lectureId,
    });
  }

  async function removeLectureHandler() {
    removeLecture({ courseId, lectureId });
  }

  useEffect(() => {
    if (isSuccess) {
      toast.success(data.message);
      navigate(`/admin/course/${courseId}/lecture`);
    }
    if (error) {
      toast.error(error.data.message);
    }
  }, [isSuccess, error]);

  useEffect(() => {
    if (removingIsSuccess) {
      toast.success(removingData.message);
      navigate(`/admin/course/${courseId}/lecture`);
    }
    if (removingError) {
      toast.error(removingError.data.message);
    }
  }, [removingIsLoading, removingIsSuccess]);

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Edit lecture</CardTitle>
          <CardDescription>
            Save when you&apos;re done with changes.
          </CardDescription>
        </div>
        <div className="flex items-center gap-2 ">
          <Button
            disabled={removingIsLoading || isLoading || btnDisable}
            variant="destructive"
            onClick={removeLectureHandler}
          >
            {removingIsLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please Wait
              </>
            ) : (
              "Remove Lecture"
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div>
          <Label>
            Title<span className="text-red-500">*</span>
          </Label>
          <Input
            value={lectureTitle}
            onChange={(e) => {
              setLectureTitle(e.target.value);
            }}
            type="text"
            placeholder="Ex. Introduction to JavaScript"
          />
        </div>
        <div className="my-5">
          <Label>
            Video{!previewVideoUrl && <span className="text-red-500">*</span>}
          </Label>
          <Input
            type="file"
            onChange={fileChangeHandler}
            accept="video/*"
            className="w-fit "
          />
          {previewVideoUrl && (
            <video
              width="320"
              height="240"
              controls
              muted
              className=" mt-2 w-96 h-56 object-contain"
              src={previewVideoUrl}
            ></video>
          )}
        </div>
        <div className="flex items-center space-x-2 my-5">
          <Switch
            id="free-preview"
            checked={isFree}
            onCheckedChange={setIsFree}
          />
          <Label htmlFor="free-preview">Free Preview</Label>
        </div>
        {mediaProgress && (
          <div className="my-4">
            <Progress value={uploadProgress} />
            <p>
              {uploadProgress == 100
                ? "Processing..."
                : uploadProgress + "% uploaded"}
            </p>
          </div>
        )}
        <div className="mt-4">
          <Button
            disabled={isLoading || removingIsLoading || btnDisable}
            onClick={editLectureHandler}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please Wait
              </>
            ) : (
              "Update Lecture"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default LectureTab;
