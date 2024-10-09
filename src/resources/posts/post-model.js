import mongoose from "mongoose";
const postSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "You must be a valid user to create a post.."],
  },
  post: {
    type: String,
    required: [true, "Make sure you are uploading the image properly.."],
  },
  caption: {
    type: String,
    required: true,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Likes",
    },
  ],
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ]
});
postSchema.virtual("commentsCount").get(function () {
  return this.comments.length;
});
postSchema.set("toJSON", { virtuals: true });

export const Post = mongoose.model("Post", postSchema);
