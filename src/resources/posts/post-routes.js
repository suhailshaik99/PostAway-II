import express from "express";
import PostController from "./post-controller.js";
import { upload } from "../../middlewares/multer.js";
import { jwtAuth } from "../../middlewares/jwtAuthorizer.js";
const router = express.Router();

router.post("/", jwtAuth, upload.single("file"), PostController.createPost);
router.get("/all", PostController.getAllPosts);
router.get("/user/:userId", PostController.getPostsByUser);
router
  .route("/:postId")
  .get(PostController.getPostById)
  .put(jwtAuth, PostController.updatePostById)
  .delete(jwtAuth, PostController.deletePostById);

export { router };
