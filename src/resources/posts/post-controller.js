import AppError from "../../utils/AppError.js";
import PostRepository from "./post-repository.js";
import { catchAsync } from "../../utils/catchAsync.js";
export default class PostController {
  static createPost = catchAsync(async (req, res, next) => {
    if (!req.file)
      return next(new AppError("Please select a post to upload..."));
    const imageUrl = `http://localhost:3000/${req.file.filename}`;
    const post = await PostRepository.createPost({
      ...req.body,
      post: imageUrl,
      userId: req.user.id
    });
    await PostRepository.pushPostToUser(req.body.userId, post._id);
    console.log(post);
    res.status(200).json({
      success: true,
      message: "Post created successfully",
      post,
    });
  });

  static getAllPosts = catchAsync(async (req, res, next) => {
    const posts = await PostRepository.getAllPosts();
    if (posts.length == 0)
      return next(new AppError("No posts found in the database..", 404));
    res.status(200).json({
      success: true,
      message: "Posts Fetched Successfully!!",
      resulsts: posts.length,
      posts,
    });
  });

  static getPostById = catchAsync(async (req, res, next) => {
    const { postId } = req.params;
    const post = await PostRepository.getPostById(postId);
    if (!post)
      return next(
        new AppError("No post found with the mentioned postId...", 404)
      );
    res.status(200).json({
      success: true,
      message: "Post fetched successfully",
      post,
    });
  });

  static getPostsByUser = catchAsync(async (req, res, next) => {
    const { userId } = req.params;
    const posts = await PostRepository.getPostsByUser(userId);
    if (posts.length == 0)
      return next(new AppError("No posts yet by this user...!", 404));
    res.status(200).json({
      success: true,
      message: "User posts fetched successfully..",
      posts,
    });
  });

  static updatePostById = catchAsync(async (req, res, next) => {
    const { postId } = req.params;
    const userId = req.user.id;
    const updatedPost = await PostRepository.updatePostById(
      userId,
      postId,
      req.body
    );
    console.log(updatedPost);
    if (!updatedPost)
      return next(new AppError("You cannot update other users post...", 403));
    res.status(201).json({
      success: true,
      message: "Post updated successfully.",
      updatedPost,
    });
  });

  static deletePostById = catchAsync(async (req, res, next) => {
    const { postId } = req.params;
    const userId = req.user.id;
    const deletedPost = await PostRepository.deletePostById(postId);
    if (!deletedPost)
      return next(new AppError("You cannot delete other user's posts...", 403));
    await PostRepository.pullPostFromUser(userId, postId);
    res.status(201).json({
      success: true,
      message: "Post deleted successfully...!",
      deletedPost,
    });
  });
}
