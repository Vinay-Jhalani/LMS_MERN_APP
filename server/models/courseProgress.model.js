import mongoose from "mongoose";

const courseProgressSchema = new mongoose.Schema({
  userId: { type: String },
  courseId: { type: String },
  lastViewed: { type: String },
  completed: { type: Boolean },
  lectureProgress: [{ type: String }],
});

export const CourseProgress = mongoose.model(
  "CourseProgress",
  courseProgressSchema
);
