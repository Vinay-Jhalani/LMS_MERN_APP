import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  function searchHandler(e) {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      navigate(`/course/search?query=${searchQuery}`);
    }
  }

  return (
    <div className="relative bg-gradient-to-r from-blue-500 to bg-indigo-600 dark:from-gray-800 dark:to-gray-900 text-center flex justify-center items-center h-[45vh] mt-14">
      <div className="max-w-3xl mx-auto ">
        <h1 className="text-white text-4xl font-bold mb-4">
          Find the best courses for you 💪🏼🚀
        </h1>
        <p className="text-gray-200 dark:text-gray-400 mb-8">
          Discover, Learn, and Grow with our wide range of courses
        </p>
        <form
          onSubmit={searchHandler}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          action=""
          className="flex items-center bg-white dark:bg-gray-300 rounded-full shadow-lg overflow-hidden max-w-xl mx-auto mb-6"
        >
          <Input
            type="text"
            placeholder="Search Courses.."
            className="flex-grow border-none focus-visible:ring-0 px-6 py-3 text-gray-900 dark:text-black placeholder-gray-400 dark:placeholder-gray-900 "
          />
          <Button
            type="submit"
            className=" bg-blue-600 dark:bg-blue-700 text-white px-6 py-3 rounded-r-full hover:bg-blue-700 dark:hover:bg-blue-800"
          >
            Search
          </Button>
        </form>
        <Button
          className="bg-white dark:bg-gray-100 dark:text-black text-blue-600 rounded-full hover:bg-gray-200"
          onClick={() => navigate("/course/search?query")}
        >
          Explore Courses
        </Button>
      </div>
    </div>
  );
}

export default HeroSection;
