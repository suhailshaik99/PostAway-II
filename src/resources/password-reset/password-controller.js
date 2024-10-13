import AppError from "../../utils/AppError.js";
import { sendEmail } from "../../utils/nodemailer.js";
import { catchAsync } from "../../utils/catchAsync.js";
import PasswordRepository from "./password-repository.js";
export default class PasswordResetController {
  static sendOtp = catchAsync(async (req, res, next) => {
    const { email } = req.body;
    const user = await PasswordRepository.getUserByEmail(email);
    if (!user)
      return next(
        new AppError("No user found with this email address...!", 404)
      );
    const otp = user.createOtp();
    await user.save({ validateBeforeSave: false });
    const message = `Your password reset OTP is: ${otp}. It is valid for 10 minutes.`;
    try {
      await sendEmail({
        email: user.email,
        subject: "Password Reset Token for PostAway Application",
        message,
      });
      res.status(200).json({
        success: true,
        message: "OTP sent successfully to the user email address.",
      });
    } catch (error) {
      user.otp = undefined;
      user.optExpires = undefined;
      await user.save({ validateBeforeSave: false });
      return next(new AppError("OTP sending failed...", 500));
    }
  });

  static verifyOtp = catchAsync(async (req, res, next) => {
    const { email, otp, password } = req.body;
    const user = await PasswordRepository.verifyUserOtp(email, otp);
    if (!user)
      return next(new AppError("Invalid OTP or OTP has been expired..."));
    user.password = password;
    user.otp = undefined;
    user.optExpires = undefined;
    await user.save({ validateBeforeSave: false });
    res.status(200).json({
      success: true,
      message: "password has reset successfully..!",
    });
  });

  static passwordReset = catchAsync(async (req, res, next) => {
    const { password, passwordConfirm } = req.body;
    const updatePassword = await PasswordRepository.passwordReset(
      req.user.email,
      password,
      passwordConfirm
    );
    if (!updatePassword)
      return next(new AppError("Error while resetting the password", 500));
    
    res.status(201).json({
      success: true,
      message: "Password reset successfully...!",
    });
  });
}
