import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
import { deleteMediaFromCloudinary, uploadMedia } from "../utils/cloudinary.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "User already exist with this email ",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      name,
      email,
      password: hashedPassword,
    });
    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
    });
  } catch (error) {
    console.log(
      "Error logging from user.controller.js register function\n",
      error
    );
    res.status(500).json({
      success: false,
      message: "Some error occurred while registering",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Incorrect email or password",
      });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({
        success: false,
        message: "Incorrect email or password",
      });
    }
    generateToken(res, user, `Welcome back ${user.name}`);
  } catch (error) {
    console.log(
      "Error logging from user.controller.js login function\n",
      error
    );
    res.status(500).json({
      success: false,
      message: "Failed to login",
    });
  }
};

export const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully.",
      success: true,
    });
  } catch (error) {
    console.log(
      "Error logging from user.controller.js logout function\n",
      error
    );
    res.status(500).json({
      success: false,
      message: "Failed to logout",
    });
  }
};
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.id;
    const user = await User.findById(userId)
      .select("-password")
      .populate("enrolledCourses");
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }
    return res.status(200).json({
      user,
      success: true,
    });
  } catch (error) {
    console.log(
      "Error logging from user.controller.js getUserProfile function\n",
      error
    );
    res.status(500).json({
      success: false,
      message: "Failed to load user",
    });
  }
};

export const updateProfile = async (req, res) => {
  let photoUrl;

  try {
    const userId = req.id;
    const { name } = req.body;
    const profilePhoto = req.file;
    if (!name && !profilePhoto) {
      res.status(500).json({ success: false, message: "Invalid credentials" });
      return;
    }
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    //extract public id of the old image from the cloudinary if exist

    if (user.photoUrl) {
      const publicId = await user.photoUrl.split("/").pop().split(".")[0]; //extracting public id
      deleteMediaFromCloudinary(publicId);
    }

    //upload new photo

    if (profilePhoto) {
      const cloudResponse = await uploadMedia(profilePhoto.path);
      photoUrl = cloudResponse.secure_url;
    }
    if (profilePhoto && name) {
      const updatedData = { name, photoUrl };
    }
    if (profilePhoto && !name) {
      const updatedData = { photoUrl };
    }
    if (name && !profilePhoto) {
      const updatedData = { name };
    }
    const updatedData =
      profilePhoto && name
        ? { name, photoUrl }
        : profilePhoto && !name
        ? { photoUrl }
        : name && !profilePhoto
        ? { name }
        : {};
    const updateUser = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
    }).select("-password");
    return res.status(200).json({
      success: true,
      user: updateUser,
      message: "Profile updated successfully.",
    });
  } catch (error) {
    console.log(
      "Error logging from user.controller.js updateProfile function\n",
      error
    );
    res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};
