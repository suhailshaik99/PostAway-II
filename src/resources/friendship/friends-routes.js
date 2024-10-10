import express from "express";
import FriendController from "./friends-controller.js";
import { jwtAuth } from "../../middlewares/jwtAuthorizer.js";

const router = express.Router();

router.get("/get-friends/:userId", FriendController.getFriendsByUser);
router.get(
  "/get-pending-requests",
  jwtAuth,
  FriendController.getPendingRequests
);
router.post(
  "/toggle-friendship/:friendId",
  jwtAuth,
  FriendController.toggleFriendRequest
);
router.post(
  "/response-to-request/:requestId",
  jwtAuth,
  FriendController.respondToFriendRequest
);
export { router };
