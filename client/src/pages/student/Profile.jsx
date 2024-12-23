import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import Course from "./Course";
import {
  useLoadUserQuery,
  useUpdateUserMutation,
} from "@/features/api/authApi";
import { Skeleton } from "@/components/ui/skeleton";
import CourseSkeleton from "@/components/CourseSkeleton";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function Profile() {
  const [name, setName] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");
  const { data: { user } = {}, isLoading, refetch } = useLoadUserQuery();
  const [
    updateUser,
    {
      data: updateUserData,
      isLoading: updateUserIsLoading,
      isError,
      error,
      isSuccess,
    },
  ] = useUpdateUserMutation();

  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  console.log(user);
  const enrolledCourses = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

  function photoChangeHandler(e) {
    const file = e.target.files?.[0];
    if (file) setProfilePhoto(file);
  }

  async function updateUserHandler() {
    console.log(name, profilePhoto);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("profilePhoto", profilePhoto);
    await updateUser(formData);
  }

  useEffect(() => {
    console.log(updateUserData);
    if (isSuccess) {
      toast.success(updateUserData?.message || "Profile Updated.");
      refetch();
      setDialogIsOpen(false);
    }
    if (isError) {
      toast.error(error?.data?.message || "Error in Updating Profile");
    }
  }, [error, updateUserData, isSuccess, isError]);

  return !isLoading ? (
    <div className="max-w-4xl mx-auto px-4 my-24">
      <h1 className="font-bold text-2xl text-center md:text-left">PROFILE</h1>
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 my-5">
        <div className="flex flex-col items-center">
          <Avatar className="h-24 w-24 md:h-32 md:w-32 mb-4">
            <AvatarImage
              src={user?.photoUrl || "https://github.com/shadcn.png"}
              alt="USER"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
        <div>
          <div className="mb-2">
            <h1 className="font-semibold text-gray-900 dark:text-gray-100 ">
              Name:
              <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                {user?.name}
              </span>
            </h1>
          </div>
          <div className="mb-2">
            <h1 className="font-semibold text-gray-900 dark:text-gray-100 ">
              Email:
              <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                {user?.email}
              </span>
            </h1>
          </div>
          <div className="mb-2">
            <h1 className="font-semibold text-gray-900 dark:text-gray-100 ">
              Role:
              <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                {user?.role.toUpperCase()}
              </span>
            </h1>
          </div>
          <Dialog open={dialogIsOpen} onOpenChange={setDialogIsOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                className="mt-2"
                onClick={() => setDialogIsOpen(true)}
              >
                Edit Profile
              </Button>
            </DialogTrigger>
            <DialogContent func={setDialogIsOpen} value={false}>
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when you&apos;re
                  done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label>Name</Label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label>Profile Photo</Label>
                  <Input
                    type="file"
                    onChange={photoChangeHandler}
                    accept="image/*"
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  disabled={updateUserIsLoading}
                  onClick={updateUserHandler}
                >
                  {updateUserIsLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
                      wait
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div>
        <h1 className="font-medium text-lg">Courses you&apos;re enrolled in</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-5">
          {enrolledCourses.length === 0 ? (
            <h1>You haven&apos;t enrolled yet</h1>
          ) : (
            enrolledCourses.map((course) => (
              <Course course={course} key={course._id} />
            ))
          )}
        </div>
      </div>
    </div>
  ) : (
    <ProfileSkeleton />
  );
}

export default Profile;

function ProfileSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 my-24">
      <h1 className="font-bold text-2xl text-center md:text-left">PROFILE</h1>

      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 my-5">
        <div className="flex flex-col items-center">
          <Skeleton className="h-24 w-24 md:h-32 md:w-32 rounded-full mb-4" />
        </div>

        <div className="w-full">
          <div className="mb-2">
            <h1 className="font-semibold text-gray-900 dark:text-gray-100">
              Name:
              <Skeleton className="ml-2 w-40 h-6 inline-block" />
            </h1>
          </div>

          <div className="mb-2">
            <h1 className="font-semibold text-gray-900 dark:text-gray-100">
              Email:
              <Skeleton className="ml-2 w-60 h-6 inline-block" />
            </h1>
          </div>

          <div className="mb-2">
            <h1 className="font-semibold text-gray-900 dark:text-gray-100">
              Role:
              <Skeleton className="ml-2 w-32 h-6 inline-block" />
            </h1>
          </div>

          <Skeleton className="w-24 h-8 mt-2 rounded-md" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <CourseSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
