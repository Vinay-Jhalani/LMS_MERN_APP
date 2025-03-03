import { Course } from "../models/course.model.js";
import { Lecture } from "../models/lecture.model.js";
import { User } from "../models/user.model.js";
import {
  deleteMediaFromCloudinary,
  deleteVideoFromCloudinary,
  uploadMedia,
} from "../utils/cloudinary.js";
import { isDescriptionEmpty } from "../utils/isDescriptionEmpty.js";

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

export const getCreatorCourses = async (req, res) => {
  try {
    const userId = req.id;
    const courses = await Course.find({ creator: userId });
    if (!courses) {
      return res.status(404).json({
        courses: [],
        message: "Course not found",
      });
    }
    return res.status(200).json({
      courses,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to get course",
    });
  }
};
export const editCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const {
      courseTitle,
      subTitle,
      description,
      category,
      courseLevel,
      coursePrice,
    } = req.body;
    const courseThumbnail = req.file;
    const userId = req.id;

    let course = await Course.findOne({ creator: userId, _id: courseId });
    if (!course) {
      return res.status(404).json({
        message: "Course not found!",
      });
    }

    const isDescriptionEmptyCheck = isDescriptionEmpty(description);

    if (
      !courseTitle ||
      !subTitle ||
      !category ||
      !courseLevel ||
      !coursePrice
    ) {
      return res.status(404).json({
        message: "Unfilled fields can't be empty",
      });
    }

    if (!isDescriptionEmptyCheck) {
      return res.status(404).json({
        message: "Description field can't be empty",
      });
    }

    if (!courseThumbnail) {
      if (!course.courseThumbnail) {
        return res.status(404).json({
          message: "Course must have a thumbnail",
        });
      }
    }

    const coursePriceAbs = Math.abs(Number(coursePrice)).toFixed(0);

    let newThumbnail;
    if (courseThumbnail) {
      if (course.courseThumbnail) {
        const publicId = course.courseThumbnail.split("/").pop().split(".")[0];
        //Deleting old thumbnail
        await deleteMediaFromCloudinary(publicId);
      }
      // uploading new Thumbnail
      newThumbnail = await uploadMedia(courseThumbnail.path);
    }

    const updateData = {
      courseTitle,
      subTitle,
      description,
      category,
      courseLevel,
      coursePrice: coursePriceAbs,
      courseThumbnail: newThumbnail?.secure_url,
    };

    course = await Course.findByIdAndUpdate(courseId, updateData, {
      new: true,
    });

    return res.status(200).json({
      course,
      message: "Course updated successfully.",
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

export const getCourseById = async (req, res) => {
  try {
    const userId = req.id;
    const { courseId } = req.params;
    const course = await Course.findOne({ creator: userId, _id: courseId });
    if (!course) {
      return res.status(404).json({
        message: "Course not found",
        success: false,
      });
    }
    res.status(200).json({
      course,
    });
  } catch (error) {
    console.log(
      "Error logging from course.controller.js getCourseById\n",
      error
    );
    return res.status(500).json({
      message: "Failed to get course",
      success: false,
    });
  }
};

export const createLecture = async (req, res) => {
  try {
    const userId = req.id;
    const { lectureTitle } = req.body;
    const { courseId } = req.params;

    if (!lectureTitle || !courseId) {
      return res.status(500).json({
        message: "Lecture title is required",
        success: false,
      });
    }

    const course = await Course.findOne({ creator: userId, _id: courseId });

    if (!course) {
      return res.status(500).json({
        message: "Something went wrong",
        success: false,
      });
    }

    const lecture = Lecture.create({ lectureTitle });

    // course.lectures.push((await lecture)._id);
    course.lectures.push((await lecture)._id);
    await course.save();

    return res.status(201).json({
      lecture,
      message: "Lecture created successfully.",
      success: true,
    });
  } catch (error) {
    console.log(
      "Error logging from course.controller.js createLecture\n",
      error
    );
    return res.status(500).json({
      message: "Failed to create lecture",
      success: false,
    });
  }
};

export const getCourseLecture = async (req, res) => {
  try {
    const userId = req.id;
    const { courseId } = req.params;

    const course = await Course.findOne({
      creator: userId,
      _id: courseId,
    }).populate("lectures");

    if (!course) {
      return res.status(404).json({
        message: "Courses not found",
      });
    }

    res.status(200).json({
      lectures: course.lectures,
    });
  } catch (error) {
    console.log(
      "Error logging from course.controller.js createLecture\n",
      error
    );
    return res.status(500).json({
      message: "Failure while loading lectures",
      success: false,
    });
  }
};

export const editLecture = async (req, res) => {
  try {
    const userId = req.id;
    const { lectureTitle, videoInfo, isPreviewFree = false } = req.body;
    if (!lectureTitle)
      return res.status(500).json({
        message: "Fields can't be empty",
      });

    if (isPreviewFree === undefined || isPreviewFree === null) {
      return res.status(500).json({
        message: "Something is fishy",
      });
    }
    const { courseId, lectureId } = req.params;
    const course = await Course.findOne({ creator: userId, _id: courseId });
    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }
    const lecture = await Lecture.findById(lectureId);

    if (!course.lectures.includes(lecture._id)) {
      return res.status(404).json({
        message: "Invalid request",
      });
    }

    if (!videoInfo && !lecture.videoUrl && !lecture.publicId) {
      return res.status(500).json({
        message: "This lecture lacks video",
      });
    }
    if (!course)
      return res.status(500).json({
        message: "Failed to get course",
      });

    if (!lecture) {
      return res.status(404).json({
        message: "Lecture not found",
      });
    }

    if (!course.lectures.includes(lecture._id)) {
      return res.status(404).json({
        message: "Invalid request",
      });
    }

    if (lecture.publicId) await deleteVideoFromCloudinary(lecture.publicId);

    if (lecture.lectureTitle != lectureTitle)
      lecture.lectureTitle = lectureTitle;

    if (videoInfo) {
      lecture.videoUrl = videoInfo.videoUrl;
      lecture.publicId = videoInfo.publicId;
    }

    if (lecture.isPreviewFree != isPreviewFree)
      lecture.isPreviewFree = isPreviewFree;
    await lecture.save();
    return res.status(200).json({
      message: "Lecture Updated",
      success: false,
    });
  } catch (error) {
    console.log("Error logging from course.controller.js editLecture\n", error);
    return res.status(500).json({
      message: "Failure while editing lectures",
      success: false,
    });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const userId = req.id;
    const { courseId } = req.params;

    const courseLectures = await Course?.findOne({
      _id: courseId,
      creator: userId,
    })
      .select("lectures, courseThumbnail")
      .populate("lectures");

    if (!courseLectures) {
      res.status(404).json({
        message: "FISHY FISH HMM.",
      });
    }

    const courseThumbnailId = courseLectures?.courseThumbnail
      ?.split("/")
      ?.pop()
      ?.split(".")[0];
    if (courseThumbnailId) {
      await deleteMediaFromCloudinary(courseThumbnailId);
    }
    const lectureIds = courseLectures?.lectures.map((lecture) =>
      lecture._id.toString()
    );
    const videoIds = courseLectures?.lectures.map(
      (lecture) => lecture.publicId
    );

    console.log(lectureIds, videoIds);

    if (Array.isArray(videoIds)) {
      const validVideoIds = videoIds.filter((id) => id !== undefined);

      if (validVideoIds.length > 0) {
        await Promise.all(
          validVideoIds.map((id) => deleteVideoFromCloudinary(id))
        );
      }
    }

    await Lecture.deleteMany({ _id: { $in: lectureIds } });

    await Course.findByIdAndDelete(courseId);

    res.status(200).json({
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const removeLecture = async (req, res) => {
  try {
    const userId = req.id;
    const { lectureId, courseId } = req.params;

    const course = await Course.findOne({ creator: userId, _id: courseId });

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    const lecture = await Lecture.findByIdAndDelete(lectureId);

    if (!lecture) {
      return res.status(404).json({
        message: "Lecture not found",
      });
    }

    if (!course.lectures.includes(lecture._id)) {
      return res.status(404).json({
        message: "Invalid request",
      });
    }
    //deleting lec from cloudinary
    if (lecture.publicId) {
      await deleteVideoFromCloudinary(lecture.publicId);
    }

    // removing lec reference from course array of associate course
    await Course.updateOne(
      { lectures: lectureId }, //find the course that contains the lecture id
      { $pull: { lectures: lectureId } } // remove lecture id from lectures array
    );

    return res.status(200).json({
      message: "Lecture removed successfully.",
    });
  } catch (error) {
    console.log(
      "Error logging from course.controller.js removeLecture\n",
      error
    );
    return res.status(500).json({
      message: "Failure in removing lecture",
      success: false,
    });
  }
};

export const getLectureById = async (req, res) => {
  try {
    const userId = req.id;

    const { lectureId, courseId } = req.params;

    const course = await Course.findOne({ creator: userId, _id: courseId });

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    const lecture = await Lecture.findById(lectureId);

    if (!lecture) {
      return res.status(404).json({
        message: "Lecture not found",
      });
    }

    if (!course.lectures.includes(lecture._id)) {
      return res.status(404).json({
        message: "Invalid request",
      });
    }
    return res.status(200).json({
      lecture,
    });
  } catch (error) {
    console.log(
      "Error logging from course.controller.js getLectureById\n",
      error
    );
    return res.status(500).json({
      message: "Failure in removing lecture",
      success: false,
    });
  }
};

export const uploadLecture = async (req, res) => {
  try {
    const userId = req.id;
    const user = await User.findOne({ _id: userId, role: "admin" });

    const result = await uploadMedia(req.file.path);
    res.status(200).json({
      message: "File uploaded successfully",
      data: result,
      success: true,
    });
  } catch (error) {
    console.log(
      "Error logging from course.controller.js uploadLecture\n",
      error
    );
    res.status(500).json({
      message: "Error uploading file",
    });
  }
};

export const togglePublishCourse = async (req, res) => {
  try {
    const userId = req.id;
    const { courseId } = req.params;
    const course = await Course.findOne({ creator: userId, _id: courseId });

    if (!course) {
      return res.status(404).json({
        message: "Course not found!",
      });
    }

    course.isPublished = !course.isPublished;

    const courseStatus =
      course.isPublished === true ? "Published" : "Unpublished";

    await course.save();

    return res.status(200).json({
      message: `Course is ${courseStatus}`,
    });
  } catch (error) {
    console.log(
      "Error logging from course.controller.js togglePublishCourse\n",
      error
    );
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const getPublishedCourses = async (_, res) => {
  try {
    const courses = await Course.find({ isPublished: true }).populate({
      path: "creator",
      select: "name photoUrl",
    });
    if (!courses) {
      return res.status(404).json({ message: "No courses found" });
    }
    res.status(200).json({
      courses,
    });
  } catch (error) {
    console.log(
      "Error logging from course.controller.js togglePublishCourse\n",
      error
    );
    res.status(500).json({
      message: "Error while fetching courses",
    });
  }
};

export const searchCourse = async (req, res) => {
  try {
    const { query = "", categories = [], sortByPrice = "" } = req.query;

    // create search query
    const searchCriteria = {
      isPublished: true,
      $or: [
        { courseTitle: { $regex: query, $options: "i" } },
        { subTitle: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
      ],
    };

    // if categories selected
    if (categories.length > 0) {
      searchCriteria.category = { $in: categories };
    }

    // define sorting order
    const sortOptions = {};
    if (sortByPrice === "low") {
      sortOptions.coursePrice = 1; //sort by price in ascending
    } else if (sortByPrice === "high") {
      sortOptions.coursePrice = -1; // descending
    }

    let courses = await Course.find(searchCriteria)
      .populate({ path: "creator", select: "name photoUrl" })
      .sort(sortOptions);

    return res.status(200).json({
      success: true,
      courses: courses || [],
    });
  } catch (error) {
    console.log(error);
  }
};
