import mongoose from "mongoose";
const likeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "You must a valid user to like a post"],
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: [true, "Mention the post id you want to like..."],
  },
});

export const Like = mongoose.model("Like", likeSchema);
