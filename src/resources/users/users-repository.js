import { User } from "./users-model.js";
import { Logout } from "./user-logout-model.js";
export default class UserRepository {
  static userSignIn = async (email, password) => {
    const user = await User.findOne({ email }).select("+password");
    if (!user) return false;
    const success = await user.comparePasswords(password, user.password);
    if (!success) return false;
    return user;
  };

  static userSignUp = async (userData) => {
    return await User.create(userData);
  };

  static getUserById = async (userId) => {
    return await User.findById(userId);
  };

  static getAllUsers = async () => {
    return await User.find({}).populate("posts");
  };

  static updateUser = async (userId, newData) => {
    return await User.findByIdAndUpdate(userId, newData, {
      new: true,
      runValidators: true,
    });
  };

  static logoutUser = async (userId, token) => {
    return await Logout.create({ userId, token });
  };

  static getUserFriends = async (userId) => {
    return await User.findById(userId).select("friends -_id");
  };

  static getPendingRequests = async (userId) => {
    return await User.findById(userId).select("incomingRequest -_id");
  };

}
