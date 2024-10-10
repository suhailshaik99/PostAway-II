import AppError from "../../utils/AppError.js";
import LikesRepository from "./likes-repository.js";
import { catchAsync } from "../../utils/catchAsync.js";
import PostRepository from "./../posts/post-repository.js";
export default class LikesController {

  static getLikesByPost = catchAsync(async (req, res, next) => {
    const { postId } = req.params;
    const post = await PostRepository.getPostById(postId);
    if (!post)
      return next(
        new AppError("Post not found with the mentioned postId..", 404)
      );
    const likes = await LikesRepository.getLikesByPost(postId);
    if (!likes)
      return res.status(200).json({
        success: true,
        message:
          "No likes for this post yet, be the first to like this post...!!",
      });
    res.status(200).json({
      success: true,
      message: "Likes fetched successfully for the mentioned post..",
      likes,
    });
  });

  static toggleLikeOnPost = catchAsync(async (req, res, next) => {
    const { postId } = req.params;
    const userId = req.user.id;
    const post = await PostRepository.getPostById(postId);
    if (!post)
      return next(
        new AppError("Post doesn't exists with the mentioned post Id..", 404)
      );
    const like = await LikesRepository.toggleLikeOnPost(userId, postId);
    if (like.status == 201) {
      const removeResult = LikesRepository.pullLikeFromPost(
        like.likeRemover._id,
        postId
      );
      if (!removeResult)
        return next(new AppError("Error while unliking the post", 500));
      return res.status(201).json({
        success: true,
        message: "Post unliked successfully...!",
        data: like.likeRemover,
      });
    }
    const result = await LikesRepository.pushLikeToPost(like._id, postId);
    if (!result) return next(new AppError("Error while liking the post", 500));
    res.status(201).json({
      success: true,
      message: "Post liked successfully..!",
      like,
    });
  });

}