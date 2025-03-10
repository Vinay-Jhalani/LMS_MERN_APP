import { Loader2, School } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Darkmode from "./Darkmode";
import MobileNavbar from "./MobileNavbar";
import { Link, useNavigate } from "react-router-dom";
import { useLogoutUserMutation } from "@/features/api/authApi";
import { useEffect } from "react";
import { toast } from "sonner";
import { useSelector } from "react-redux";

function Navbar() {
  const navigate = useNavigate();
  const { user, isLoading } = useSelector((Store) => Store.auth);
  console.log(isLoading);

  const role = "instructor";
  const [logoutUser, { data, isSuccess }] = useLogoutUserMutation();

  const logoutHandler = async () => {
    await logoutUser();
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data.message || "User logged out");
      navigate("/login");
    }
  }, [isSuccess]);

  return (
    <div className="h-16 dark:bg-[#0A0A0A] bg-white border-b dark:border-b-gray-800 border-b-gray-200 duration-300 z-10 fixed top-0 left-0 right-0 ">
      {/* DESKTOP */}
      <div className="max-w-7xl mx-auto hidden md:flex justify-between items-center gap-10 h-full">
        <Link to={"/"}>
          <div className="flex items-center">
            <img src="/logo.png" width="5%" />
            <h1 className="hidden md:block font-bold text-2xl ml-1">
              CourseCo.
            </h1>
          </div>
        </Link>
        {/* User icon and dark mode icon */}
        <div className="flex items-center gap-8">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar>
                  <AvatarImage
                    src={user?.photoUrl || "https://github.com/shadcn.png"}
                    alt="V"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 z-50">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <Link to="/my-learning">
                    <DropdownMenuItem>
                      <span>My Learning</span>
                    </DropdownMenuItem>
                  </Link>
                  <Link to="/profile">
                    <DropdownMenuItem>
                      <span>Edit Profile</span>
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem onClick={logoutHandler}>
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <Link to={"/admin/dashboard"}>
                  <DropdownMenuItem>
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : isLoading ? (
            <Loader2 className="animate-spin " />
          ) : (
            <div className=" flex items-center gap-2">
              <Button variant="outline" onClick={() => navigate("/login")}>
                Login
              </Button>
              <Button onClick={() => navigate("/login")}>Register</Button>
            </div>
          )}{" "}
          <Darkmode />
        </div>
      </div>
      {/* SMALL DEVICES */}
      <div className="flex md:hidden justify-between mr-3 ml-3 items-center h-full">
        <div className="flex gap-1 items-center">
          <div
            className="flex gap-1 items-center"
            onClick={() => navigate("/")}
          >
            {" "}
            <img src="/logo.png" className="w-[7%]" />
            <p className="font-bold">CourseCo.</p>
          </div>
        </div>
        <MobileNavbar role={role} />
      </div>
    </div>
  );
}

export default Navbar;
