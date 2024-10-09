import express from "express";
import CommentsController from "./comments-controller.js";
import { jwtAuth } from "../../middlewares/jwtAuthorizer.js";

const router = express.Router();

router
  .route("/:postId")
  .get(CommentsController.getCommentsByPost)
  .post(jwtAuth, CommentsController.addCommentToPost);
router
  .route("/:commentId")
  .put(jwtAuth, CommentsController.updateCommentOnPost)
  .delete(jwtAuth, CommentsController.deleteCommentOnPost);

export { router };
