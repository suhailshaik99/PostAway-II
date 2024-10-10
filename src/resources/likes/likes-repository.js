import { Like } from "./likes-model.js";
import { Post } from "../posts/post-model.js";
export default class LikesRepository {
  static getLikesByPost = async (postId) => {
    return await Like.find({ postId });
  };

  static toggleLikeOnPost = async (userId, postId) => {
    const likeChecker = await Like.findOne({ postId, userId });
    if (!likeChecker) return await Like.create({ userId, postId });
    const likeRemover = await Like.findOneAndDelete(
      { postId, userId },
      likeChecker._id
    );
    return {
      status: 201,
      message: "Unliked post successfully.",
      likeRemover,
    };
  };

  static pushLikeToPost = async (likeId, postId) => {
    return await Post.findByIdAndUpdate(postId, { $push: { likes: likeId } });
  };

  static pullLikeFromPost = async (likeId, postId) => {
    return await Post.findByIdAndUpdate(postId, { $pull: { likes: likeId } });
  };
}
