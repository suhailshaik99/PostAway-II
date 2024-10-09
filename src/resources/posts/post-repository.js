import { Post } from "./post-model.js";
import { User } from "../users/users-model.js";
export default class PostRepository {
  static createPost = async (post) => {
    return Post.create(post);
  };

  static getAllPosts = async () => {
    return Post.find({}).populate("userId");
  };

  static getPostById = async (postId) => {
    return Post.findById(postId);
  };

  static getPostsByUser = async (userId) => {
    return Post.find({ userId });
  };

  static updatePostById = async (userId, postId, data) => {
    return Post.findOneAndUpdate({userId, _id: postId}, data, {
      new: true,
      runValidators: true,
    });
  };

  static deletePostById = async (userId, postId) => {
    return Post.findOneAndDelete({_id: postId, userId});
  };

  static pushPostToUser = async (userId, postId) => {
    await User.findByIdAndUpdate(userId, { $push: { posts: postId } });
  };

  static pullPostFromUser = async (userId, postId) => {
    await User.findByIdAndUpdate(userId, { $pull: { posts: postId } });
  };
}
