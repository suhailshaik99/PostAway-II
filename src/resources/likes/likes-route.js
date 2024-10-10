import express from "express";
import LikesController from "./likes-controller.js";
import { jwtAuth } from "./../../middlewares/jwtAuthorizer.js";

const router = express.Router();

router.get("/:postId", LikesController.getLikesByPost);
router.post("/toggle/:postId", jwtAuth, LikesController.toggleLikeOnPost);

export { router };
