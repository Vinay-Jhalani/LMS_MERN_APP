import https from "https";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const caPath = path.resolve(__dirname, "../cloudinary.pem");

dotenv.config({});

cloudinary.config({
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  secure: true,
});

const agent = new https.Agent({
  ca: fs.readFileSync(caPath),
});

export const uploadMedia = async (file) => {
  try {
    const uploadResponse = await cloudinary.uploader.upload(file, {
      resource_type: "auto",
      secure: true,
    });

    fs.unlink(file, (err) => {
      if (err) {
        console.log(
          "Error logging from cloudinary.js uploadMedia fs.unlink \n",
          err
        );
      }
    });

    return uploadResponse;
  } catch (error) {
    console.log(
      "Error logging from cloudinary.js uploadMedia function\n",
      error
    );
  }
};

export const deleteMediaFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId, { agent });
  } catch (error) {
    console.log(
      "Error logging from cloudinary.js deleteMediaFromCloudinary function\n",
      error
    );
  }
};

export const deleteVideoFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: "video",
      agent: agent,
    });
  } catch (error) {
    console.log(
      "Error logging from cloudinary.js deleteVideoFromCloudinary function\n",
      error
    );
  }
};
