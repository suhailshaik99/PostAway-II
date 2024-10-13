import crypto from "crypto";
import { User } from "../users/users-model.js";
export default class PasswordRepository {
  static getUserByEmail = async (email) => {
    return await User.findOne({ email });
  };

  static verifyUserOtp = async (email, otp) => {
    return await User.findOne({
      email,
      otp: crypto.createHash("sha256").update(otp).digest("hex"),
      optExpires: { $gt: Date.now() },
    });
  };

  static passwordReset = async (email, password, passwordConfirm) => {
    const user = await this.getUserByEmail(email);
    user.password = password;
    user.passwordConfirm = passwordConfirm;
    await user.save();
    return user;
  };
}
