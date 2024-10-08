import jwt from "jsonwebtoken";
import AppError from "../../utils/AppError.js";
import UserRepository from "./users-repository.js";
import { catchAsync } from "./../../utils/catchAsync.js";
export default class UserController {
  static userSignIn = catchAsync(async (req, res, next) => {
    if (!req.body.email || !req.body.password) {
      return next(new AppError("Please enter username and password", 400));
    }
    const user = await UserRepository.userSignIn(
      req.body.email,
      req.body.password
    );
    if (!user) return next(new AppError("Invalid User Credentials", 403));
    let payload = {
      id: user._id,
      email: user.email,
    };
    let token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "5m" });
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: true,
      maxAge: 5 * 60 * 1000,
    });
    res.status(200).json({
      success: true,
      message: "Logged In Successfully!!",
      token,
    });
  });

  static userSignUp = catchAsync(async (req, res, next) => {
    const user = await UserRepository.userSignUp(req.body);
    res.status(200).json({
      success: true,
      message: "User Registered Successfully!!",
      user,
    });
  });

  static getUser = catchAsync(async (req, res, next) => {
    const { userId } = req.params;
    const user = await UserRepository.getUser(userId);
    res.status(200).json({
      success: true,
      message: "User fetched Successfully",
      user,
    });
  });

  static getAllUsers = catchAsync(async (req, res, next) => {
    const users = await UserRepository.getAllUsers();
    if (users.length == 0)
      return next(new AppError("No users found in the database", 404));
    res.status(200).json({
      success: true,
      message: "Users Fetched successfully..",
      results: users.length,
      users,
    });
  });

  static updateUser = catchAsync(async (req, res, next) => {
    if (req.body.password || req.body.passwordConfirm)
      return next(
        new AppError(
          `This route: ${req.originalUrl} is not changing the password. Please choose the appropriate request...`
        )
      );
    const { userId } = req.params;
    const newData = req.body;
    const updatedUser = await UserRepository.updateUser(userId, newData);
    res.status(201).json({
      success: true,
      message: "User details updated successfully...",
      updatedUser,
    });
  });

  static logoutUser = catchAsync(async (req, res, next) => {
    const token = req.cookies.jwt;
    const { userId } = req.body;
    const status = await UserRepository.logoutUser(userId, token);
    console.log(status);
    if (!status)
      return next(new AppError("Error logging out the user...", 500));
    res.status(200).json({
      success: true,
      message: "User Logged out successfully...",
    });
  });
}
