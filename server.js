import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import AppError from "./src/utils/AppError.js";
import { connectDB } from "./src/database/db-config.js";
import { globalHandler } from "./src/utils/globalError.js";
import { router as userRouter } from "./src/resources/users/users-routes.js";

dotenv.config({ path: "./config.env" });
const app = express();

// Global Middlwares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Application Routes
app.use("/api/users", userRouter);

// Middleware to handle the unhandled routes
app.all("*", (req, res, next) => {
  next(
    new AppError(
      `This url: ${req.originalUrl} cannot be accessed on this server.`,
      400
    )
  );
});

// Global Error Handler Middleware
app.use(globalHandler);

// Starting the server
app.listen(process.env.PORT, async () => {
  await connectDB();
  console.log(`Application is listening on port ${process.env.PORT}`);
});
