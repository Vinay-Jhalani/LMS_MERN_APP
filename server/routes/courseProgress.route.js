import express from "express";

import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import {
  getCertificate,
  purchasedCourseLectures,
  updateLectureProgress,
} from "../controllers/courseProgress.controller.js";

const router = express.Router();

router.route("/course/:courseId").get(isAuthenticated, purchasedCourseLectures);
router.route("/getCertificate/:courseId/").get(isAuthenticated, getCertificate);
router
  .route("/:courseId/update-details")
  .post(isAuthenticated, updateLectureProgress);

export default router;
