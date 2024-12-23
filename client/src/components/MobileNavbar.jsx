import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import Darkmode from "./Darkmode";
import { Separator } from "./ui/separator";

// eslint-disable-next-line react/prop-types
function MobileNavbar({ role }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className="rounded border-none shadow-none hover:text-bold"
        >
          <Menu className="text-black" />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col ">
        <SheetHeader className="flex flex-row items-center justify-between mt-5">
          <SheetTitle>E-LEARNING</SheetTitle>
          <SheetDescription></SheetDescription>
          <Darkmode />
        </SheetHeader>
        <Separator />
        <nav className="flex flex-col space-y-4">
          <span>My Learning</span>
          <span>Edit Profile</span>
          <span>Logout</span>
        </nav>
        {role === "instructor" && <Separator />}
        {role === "instructor" && (
          <SheetFooter>
            <SheetClose asChild>
              <Button type="submit">Dashboard</Button>
            </SheetClose>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}

export default MobileNavbar;
