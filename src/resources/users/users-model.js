import bcrypt from "bcrypt";
import mongoose from "mongoose";
import validator from "validator";
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minLength: [5, "Name should contain a minimum of 5 characters"],
      maxLength: [20, "Name cannot be more than 15 characters"],
      required: [true, "Please tell us your name"],
      trim: true,
    },
    email: {
      type: String,
      validate: [validator.isEmail, "Please provide a valid email address"],
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please enter your password."],
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, "Please confirm your password."],
      min: [8, "Weak password!!, please ensure a password of minimum length 8"],
      validate: {
        validator: function (passwd) {
          return passwd === this.password;
        },
        message: "Password doesn't match!!",
      },
    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
    },
    avatar: {
      type: String,
    },
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    incomingRequest: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Friend",
      },
    ],
    outgoingRequest: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Friend",
      },
    ],
  },
  { timestamps: true }
);

// Schema Method
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});
// Schema Method
userSchema.methods.comparePasswords = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

export const User = mongoose.model("User", userSchema);
