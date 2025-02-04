import Stripe from "stripe";
import { Course } from "../models/course.model.js";
import { coursePurchase } from "../models/coursePurchase.model.js";
import { Lecture } from "../models/lecture.model.js";
import { User } from "../models/user.model.js";
import { CourseProgress } from "../models/courseProgress.model.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  try {
    const userId = req.id;
    const { courseId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found!" });

    //create a new purchase record
    const newPurchase = new coursePurchase({
      courseId,
      userId,
      amount: course.coursePrice,
      status: "pending",
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: course.courseTitle,
              images: [course.courseThumbnail],
            },
            unit_amount: course.coursePrice * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/course-progress/${courseId}`,
      cancel_url: `${process.env.CLIENT_URL}/course-detail/${courseId}`,
      metadata: {
        courseId: courseId,
        userId: userId,
      },
      shipping_address_collection: {
        allowed_countries: ["IN"],
      },
    });

    if (!session.url) {
      return res
        .status(400)
        .json({ success: false, message: "Error while payment processing" });
    }

    //saving the purchase record

    newPurchase.paymentId = session.id;
    await newPurchase.save();

    return res.status(200).json({
      success: true,
      url: session.url,
    });
  } catch (error) {
    console.log(
      "Error logging from course.controller.js createLecture\n",
      error
    );
    return res.status(500).json({
      message: "Error from payment gateway",
      success: false,
    });
  }
};

export const webhook = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  let event;

  try {
    const payloadString = JSON.stringify(req.body, null, 2);
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    const header = stripe.webhooks.generateTestHeaderString({
      payload: payloadString,
      secret,
    });
    event = stripe.webhooks.constructEvent(payloadString, header, secret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log(event.type);

  if (event.type == "checkout.session.completed") {
    try {
      const session = event.data.object;

      const purchase = await coursePurchase
        .findOne({
          paymentId: session.id,
        })
        .populate({ path: "courseId" });

      if (!purchase) {
        console.log("Purchase not found");
        return res.status(404).json({ message: "Purchase not found" });
      }

      if (session.amount_total) {
        purchase.amount = session.amount_total / 100;
      }

      purchase.status = "completed";

      // if (purchase.courseId && purchase.courseId.lectures.length > 0) {
      //   await Lecture.updateMany(
      //     { _id: { $in: purchase.courseId.lectures } },
      //     { $set: { isPreviewFree: true } }
      //   );
      // }

      await purchase.save();

      //update user enrolled courses
      await User.findByIdAndUpdate(
        purchase.userId,
        { $addToSet: { enrolledCourses: purchase.courseId._id } },
        { new: true }
      );

      //Add user id to enrolled students in course
      const updatedCourse = await Course.findByIdAndUpdate(
        purchase.courseId._id,
        { $addToSet: { enrolledStudents: purchase.userId } },
        { new: true }
      )
        .select("lectures")
        .populate("lectures");

      const firstLec = updatedCourse.lectures[0]._id.toString();

      await CourseProgress.create({
        userId: purchase.userId,
        courseId: purchase.courseId._id,
        completed: false,
        lectureProgress: [firstLec],
        lastViewed: `${firstLec}`,
      });
    } catch {
      console.error("Error handling webhook:", err);
      res.status(500).send("Internal Server Error");
    }
  }
  res.status(200).send();
};

export const getCourseDetailWithPurchaseStatus = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;

    let course = await Course.findById(courseId)
      .populate({ path: "creator", select: "-password" })
      .populate({ path: "lectures" });

    if (course?.lectures) {
      // Map and modify the lectures based on isPreviewFree
      const modifiedLectures = course.lectures.map((lecture) => {
        if (lecture.isPreviewFree) {
          // Include videoUrl when isPreviewFree is true
          return lecture;
        } else {
          // Exclude videoUrl when isPreviewFree is false
          const { videoUrl, ...rest } = lecture.toObject();
          return rest;
        }
      });

      // Assign the modified lectures to a new field or overwrite
      course = {
        ...course.toObject(), // Convert the entire course document to a plain object
        lectures: modifiedLectures, // Assign the modified lectures here
      };
    }

    const purchased = await coursePurchase.findOne({
      userId,
      courseId,
      status: "completed",
    });
    // console.log(purchased);

    if (!course) {
      return res.status(404).json({ message: "course not found!" });
    }

    return res.status(200).json({
      course,
      purchased: !!purchased, // true if purchased, false otherwise
    });
  } catch (error) {
    console.log(error);
  }
};

export const getAllPurchasedCourse = async (_, res) => {
  try {
    const purchasedCourse = await coursePurchase
      .find({
        status: "completed",
      })
      .populate("courseId");
    if (!purchasedCourse) {
      return res.status(404).json({
        purchasedCourse: [],
      });
    }
    return res.status(200).json({
      purchasedCourse,
    });
  } catch (error) {
    console.log(error);
  }
};
