import express from "express";
import upload from "../utils/multer.js";
import { uploadMedia } from "../utils/cloudinary.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { uploadLecture } from "../controllers/course.controller.js";

const router = express.Router();

router
  .route("/upload-video")
  .post(isAuthenticated, upload.single("file"), uploadLecture);

export default router;
