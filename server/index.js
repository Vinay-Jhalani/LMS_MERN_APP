import express from "express";
import dotenv from "dotenv";
import connectDB from "./database/db.js";
import userRoute from "./routes/user.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config({});

const app = express();

const PORT = process.env.PORT || 3000;

//default middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError) {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON format. Please check your request.",
    });
  }
  next();
});

//apis
app.use("/api/v1/user", userRoute);

try {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`SERVER LISTENING ON PORT ${PORT} `);
  });
} catch (error) {
  console.log("ERROR IN CONNECTING DB \n", error);
}
