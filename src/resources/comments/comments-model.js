import mongoose from "mongoose";
const commentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "You must a valid user to post a comment."],
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: [true, "Do let us know the post you want to comment on.."],
    },
    comment: {
      type: String,
      required: [true, "Cannot post an empty comment.."],
    },
  },
  {
    timestamps: true,
  }
);

export const Comment = mongoose.model("Comment", commentSchema);