import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import {
  createCourse,
  createLecture,
  deleteCourse,
  editCourse,
  editLecture,
  getCourseLecture,
  getCreatorCourses,
  getLectureById,
  getPublishedCourses,
  removeLecture,
  searchCourse,
  togglePublishCourse,
} from "../controllers/course.controller.js";
import upload from "../utils/multer.js";
import { getCourseById } from "../controllers/course.controller.js";

const router = express.Router();

router.route("/").post(isAuthenticated, createCourse);
router.route("/search").get(searchCourse);
router.route("/getPubCourses").get(getPublishedCourses);
router.route("/").get(isAuthenticated, getCreatorCourses);
router.route("/:courseId").get(isAuthenticated, getCourseById);
router
  .route("/:courseId")
  .put(isAuthenticated, upload.single("courseThumbnail"), editCourse);
router.route("/:courseId/lecture").post(isAuthenticated, createLecture);
router.route("/:courseId/lecture").get(isAuthenticated, getCourseLecture);
router
  .route("/:courseId/lecture/:lectureId")
  .post(isAuthenticated, editLecture);
router
  .route("/:courseId/lecture/:lectureId")
  .delete(isAuthenticated, removeLecture);
router
  .route("/:courseId/lecture/:lectureId")
  .get(isAuthenticated, getLectureById);

router.route("/:courseId").patch(isAuthenticated, togglePublishCourse);
router.route("/deleteCourse/:courseId").post(isAuthenticated, deleteCourse);

export default router;
