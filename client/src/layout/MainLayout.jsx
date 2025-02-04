import Navbar from "@/components/Navbar";

import { Outlet } from "react-router-dom";

function MainLayout({ confettiState, setConfettiState }) {
  return (
    <div className="">
      <Navbar
        confettiState={confettiState}
        setConfettiState={setConfettiState}
      />
      <Outlet />
    </div>
  );
}

export default MainLayout;
