import mongoose from "mongoose";
import { Course } from "../models/course.model.js";
import { User } from "../models/user.model.js";
import { CourseProgress } from "../models/courseProgress.model.js";
import { PDFDocument, rgb } from "pdf-lib";
const fontkit = await import("fontkit");
import fs from "fs";
const existingPdfBytes = fs.readFileSync(
  "../../../../../NEW_LMS/LMS_MERN_APP/server/assets/template.pdf"
);
const cocomatProBuffer = fs.readFileSync(
  "../../../../../NEW_LMS/LMS_MERN_APP/server/assets/CocomatPro.ttf"
);
const montserratBuffer = fs.readFileSync(
  "../../../../../NEW_LMS/LMS_MERN_APP/server/assets/montserrat.ttf"
);

export const purchasedCourseLectures = async (req, res) => {
  try {
    const userId = req.id;
    const { courseId } = req.params;
    if (!userId || !courseId) {
      return res.status(404).json({
        message: "Something is wrong",
        success: false,
      });
    }
    const course = await Course.findOne({
      _id: courseId,
      enrolledStudents: userId,
    })
      .select("courseTitle lectures")
      .populate({
        path: "lectures",
        options: { sort: { _id: 1 } },
      });

    if (!course) {
      res.status(404).json({
        message: "You haven't purchased this course.",
      });
    }

    res.status(200).json({
      course,
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateLectureProgress = async (req, res) => {
  try {
    const userId = req.id;
    const { courseId } = req.params;

    const course = await Course.findById(courseId);

    if (!userId || !courseId || !course) {
      return res.status(404).json({
        message: "Something is wrong",
        success: false,
      });
    }
    let progress = await CourseProgress.collection.findOne({
      userId,
      courseId,
    });

    if (!req.body.currentLecture) {
      return res.status(200).json({ progress });
    }

    let isCompleted;

    const currentLecture = req.body.currentLecture || progress.lastViewed;

    const lectureProgress = progress.lectureProgress;

    if (!lectureProgress.includes(currentLecture)) {
      lectureProgress.push(currentLecture);
      progress = await CourseProgress.collection.findOneAndUpdate(
        { userId, courseId },
        {
          $set: {
            lastViewed: currentLecture,
            lectureProgress: lectureProgress,
            completed: isCompleted,
          },
        },
        { returnDocument: "after" }
      );
    } else {
      progress = await CourseProgress.collection.findOneAndUpdate(
        { userId, courseId },
        {
          $set: {
            lastViewed: currentLecture,
            completed: isCompleted,
          },
        },
        { returnDocument: "after" }
      );
    }

    if (progress.lectureProgress.length === course.lectures.length) {
      isCompleted = true;
    } else {
      isCompleted = false;
    }

    if (isCompleted) {
      progress = await CourseProgress.collection.findOneAndUpdate(
        { userId, courseId },
        {
          $set: {
            completed: isCompleted,
          },
        },
        { returnDocument: "after" }
      );
    }

    return res.status(200).json({ progress });
  } catch (error) {
    console.log(error);
  }
};

export const getCertificate = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;
    const course = await Course.findById(courseId);
    const user = await User.findById(userId);

    if (!courseId || !userId || !course || !user) {
      res.status(404).json({
        message: "Something went wrong.",
      });
    }

    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    // Register fontkit for custom fonts
    pdfDoc.registerFontkit(fontkit);

    // Load the font file

    const CocomatPro = await pdfDoc.embedFont(cocomatProBuffer);
    const Montserrat = await pdfDoc.embedFont(montserratBuffer);

    // Get the first page of the document
    const page = pdfDoc.getPages()[0];

    // Define text properties
    const name = `${user.name}`.toUpperCase();
    const nameFontSize = 54;
    const courseName = `${course.courseTitle}`;
    const courseFontSize = 16;

    // Calculate the text width using the font object
    const nameTextWidth = CocomatPro.widthOfTextAtSize(name, nameFontSize);
    const courseTextWidth = Montserrat.widthOfTextAtSize(
      courseName,
      courseFontSize
    );
    const { width, height } = page.getSize();

    // Draw centered text
    page.drawText(name, {
      x: (width - nameTextWidth) / 2, // Center horizontally
      y: height / 2 + 8, // Center vertically
      size: nameFontSize,
      font: CocomatPro,
      color: rgb(0.0039, 0.3529, 0.3216),
    });

    page.drawText(courseName, {
      x: (width - courseTextWidth) / 2, // Center horizontally
      y: height / 3 + 25, // Center vertically
      size: courseFontSize,
      font: Montserrat,
      color: rgb(0.3765, 0.3765, 0.3765),
    });

    // Save the edited PDF
    const pdfBytes = await pdfDoc.save();

    // Set the appropriate headers and send the PDF
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=certificate.pdf"
    );

    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).send("An error occurred while generating the PDF.");
  }
};
