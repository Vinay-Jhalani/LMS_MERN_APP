import { Course } from "../models/course.model.js";

export const createCourse = async (req, res) => {
  try {
    const { courseTitle, category } = req.body;
    if (!courseTitle || !category) {
      return res.status(400).json({
        message: "Course title and category can't be empty ",
      });
    }
    const course = await Course.create({
      courseTitle,
      category,
      creator: req.id,
    });
    return res.status(201).json({
      course,
      message: "Course created.",
    });
  } catch (error) {
    console.log(
      "Error logging from course.controller.js createCourse\n",
      error
    );
    return res.status(500).json({
      message: "failed to create course",
      success: false,
    });
  }
};
