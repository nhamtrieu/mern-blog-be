import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";

import userRoute from "./routes/user.route.js";
import authRoute from "./routes/auth.route.js";
import postRoute from "./routes/post.route.js";
import commentRoute from "./routes/comment.route.js";

dotenv.config();

mongoose
    .connect(process.env.MONGO)
    .then(() => {})
    .catch((err) => {
        console.log(err);
    });
const __dirname = path.resolve();

const app = express();
const port = 3000;

app.use(express.json());
app.use(cookieParser());

app.listen(port, () => {});

app.use("/api/v1/user", userRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/comment", commentRoute);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal server error";
    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});
