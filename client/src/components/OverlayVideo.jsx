/* eslint-disable react/prop-types */
import { XIcon } from "lucide-react";
import ReactPlayer from "react-player";

function OverlayVideo({ children, visible, cross }) {
  return (
    <div
      className={`fixed top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 z-50 bg-black w-[100%] h-[100%] text-white bg-opacity-85 flex items-center justify-center  ${
        !visible && "hidden"
      }`}
    >
      <XIcon
        size={50}
        className=" absolute top-[5%] right-[5%] cursor-pointer"
        onClick={() => cross(false)}
      />
      <div className="w-[100%] h-auto md:w-[80%] md:h-[90%] aspect-video mb-4 opacity-100 bg-black flex items-center justify-center">
        <ReactPlayer
          playing={visible}
          width="100%"
          height={"100%"}
          className="object-contain  "
          url={children}
          controls={true}
        />
      </div>
    </div>
  );
}

export default OverlayVideo;
