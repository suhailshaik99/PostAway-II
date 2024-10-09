import { Post } from "../posts/post-model.js";
import { Comment } from "./comments-model.js";
export default class CommentsRepository {
  static getCommentsByPost = async (postId) => {
    return await Post.findById(postId)
      .select("comments -_id")
      .populate("comments");
  };

  static getCommentById = async (commentId) => {
    return Comment.findById(commentId);
  };

  static addCommentToPost = async (userId, postId, comment) => {
    const data = {
      userId,
      postId,
      comment,
    };
    return await Comment.create(data);
  };

  static deleteCommentOnPost = async (commentId, userId) => {
    return await Comment.findOneAndDelete({ _id: commentId, userId });
  };

  static updateCommentOnPost = async (commentId, userId, comment) => {
    return await Comment.findOneAndUpdate({ _id: commentId, userId }, comment, {
      new: true,
      runValidators: true,
    });
  };

  static pushCommentToPost = async (postId, commentId) => {
    return await Post.findByIdAndUpdate(
      postId,
      { $push: { comments: commentId } },
      { new: true }
    );
  };

  static pullCommentFromPost = async (postId, commentId) => {
    return await Post.findByIdAndUpdate(postId, {
      $pull: { comments: commentId },
    });
  };
}
