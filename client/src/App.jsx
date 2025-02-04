import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import HeroSection from "./pages/student/HeroSection";
import MainLayout from "./layout/MainLayout";
import Courses from "./pages/student/Courses";
import MyLearning from "./pages/student/MyLearning";
import Profile from "./pages/student/Profile";
import Sidebar from "./pages/admin/lecture/Sidebar";
import Dashboard from "./pages/admin/lecture/Dashboard";
import CourseTable from "./pages/admin/course/CourseTable";
import AddCourse from "./pages/admin/course/AddCourse";
import EditCourse from "./pages/admin/course/EditCourse";
import CreateLecture from "./pages/admin/lecture/createLecture";
import EditLecture from "./pages/admin/lecture/EditLecture";
import CourseDetail from "./pages/student/CourseDetail";
import CourseProgress from "./pages/student/CourseProgress";
import { useState } from "react";

function App() {
  const [confettiState, setConfettiState] = useState(false);

  const appRouter = createBrowserRouter([
    {
      path: "/",
      element: (
        <MainLayout
          confettiState={confettiState}
          setConfettiState={setConfettiState}
        />
      ),
      children: [
        {
          path: "/",
          element: (
            <>
              <HeroSection />
              <Courses />
            </>
          ),
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "my-learning",
          element: <MyLearning />,
        },
        {
          path: "profile",
          element: <Profile />,
        },
        { path: "course-detail/:courseId", element: <CourseDetail /> },
        {
          path: "course-progress/:courseId",
          element: (
            <CourseProgress
              confettiState={confettiState}
              setConfettiState={setConfettiState}
            />
          ),
        },

        //admin routes
        {
          path: "admin",
          element: <Sidebar />,
          children: [
            { path: "dashboard", element: <Dashboard /> },
            { path: "course", element: <CourseTable /> },
            { path: "course/create", element: <AddCourse /> },
            { path: "course/:courseId", element: <EditCourse /> },
            { path: "course/:courseId/lecture", element: <CreateLecture /> },
            {
              path: "course/:courseId/lecture/:lectureId",
              element: <EditLecture />,
            },
          ],
        },
      ],
    },
  ]);

  return (
    <main>
      <RouterProvider router={appRouter} />
    </main>
  );
}

export default App;
