import AppError from "../../utils/AppError.js";
import { catchAsync } from "../../utils/catchAsync.js";
import CommentsRepository from "./comments-repository.js";
export default class CommentsController {
  static getCommentsByPost = catchAsync(async (req, res, next) => {
    const { postId } = req.params;
    const comments = await CommentsRepository.getCommentsByPost(postId);
    if (comments.comments.length == 0)
      return res.status(200).json({
        success: true,
        message:
          "No comments yet on this post.. Be the first to make comment on this post...",
      });
    res.status(200).json({
      success: true,
      message: "Comments fetched successfully for the mentioned post",
      comments,
    });
  });

  static addCommentToPost = catchAsync(async (req, res, next) => {
    const { postId } = req.params;
    const userId = req.user.id;
    const comment = req.body.comment;
    const addedComment = await CommentsRepository.addCommentToPost(
      userId,
      postId,
      comment
    );
    const result = await CommentsRepository.pushCommentToPost(
      postId,
      addedComment._id
    );
    if (!result)
      return next(new AppError("Error while commenting on the post...", 500));
    res.status(201).json({
      success: true,
      message: "Comment added successfully to the mentioned post..",
      addedComment,
    });
  });

  static updateCommentOnPost = catchAsync(async (req, res, next) => {
    const { commentId } = req.params;
    const comment = CommentsRepository.getCommentById(commentId);
    if (!comment)
      return next(
        new AppError("There's no comment with the mentioned commentId..!", 404)
      );
    const userId = req.user.id;
    const updatedComment = await CommentsRepository.updateCommentOnPost(
      commentId,
      userId,
      req.body
    );
    console.log("commentId: ", commentId, "\n", "userId: ", userId);
    if (!updatedComment)
      return next(
        new AppError(
          "You cannot modify the comments made by other users...",
          400
        )
      );
    res.status(201).json({
      success: true,
      message: "Comment updated successfully...!",
      updatedComment,
    });
  });

  static deleteCommentOnPost = catchAsync(async (req, res, next) => {
    const { commentId } = req.params;
    const userId = req.user.id;
    const comment = await CommentsRepository.getCommentById(commentId);
    console.log(comment);
    if (!comment)
      return next(
        new AppError("There's no comment with the mentioned commentId..!", 404)
      );
    console.log(comment.postId);
    const deletedComment = await CommentsRepository.deleteCommentOnPost(
      commentId,
      userId
    );
    console.log(deletedComment);
    if (!deletedComment)
      return next(
        new AppError(
          "You cannot delete the comments made by other users...",
          400
        )
      );
    const result = await CommentsRepository.pullCommentFromPost(
      comment.postId,
      commentId
    );
    console.log(result);
    if (!result)
      return next(
        new AppError("Error while deleting the comment from the post..", 500)
      );
    res.status(201).json({
      success: true,
      message: "Comment deleted successfully...!",
      deletedComment,
    });
  });
}
