import { catchAsync } from "./../../utils/catchAsync.js";
import FriendRepository from "./friends-repository.js";
import UserRepository from "./../users/users-repository.js";
import AppError from "../../utils/AppError.js";
export default class FriendController {
  static getFriendsByUser = catchAsync(async (req, res, next) => {
    const { userId } = req.params;
    const user = await UserRepository.getUserById(userId);
    if (!user)
      return next(
        new AppError("No user found with the mentioned userId...!", 404)
      );
    const friends = await FriendRepository.getFriendsByUser(userId);
    if (friends.friends.length == 0) {
      return res.status(200).json({
        success: true,
        message:
          "No friends to show for this user.. Send a friend request to be the first friend of this user..",
      });
    }
    res.status(200).json({
      success: true,
      messages: "Friends fetched successfully",
      friends,
    });
  });

  static getPendingRequests = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const requests = await FriendRepository.getPendingRequests(userId);
    if (requests.incomingRequest.length == 0) {
      return res.status(200).json({
        success: true,
        message: "You have no pending requests... All good!!",
      });
    }
    res.status(200).json({
      success: true,
      message: "Pending requests found!!!.. Need appropriate action on it..",
      requests,
    });
  });

  static toggleFriendRequest = catchAsync(async (req, res, next) => {
    const { friendId } = req.params;
    const userId = req.user.id;
    if (userId === friendId)
      return next(
        new AppError(
          "You cannot send request to self, please try a valid friendId..",
          400
        )
      );
    const friend = await UserRepository.getUserById(friendId);
    if (!friend)
      return next(
        new AppError("This user no more exist, to send a friend request..", 404)
      );
    const checkFriends = await UserRepository.checkFriends(userId, friendId);
    const reqStats = await FriendRepository.getRequestStatus(userId, friendId);

    if (!reqStats) {
      const sendRequest = await FriendRepository.sendRequestToUser(
        userId,
        friendId
      );

      if (!sendRequest)
        return next(
          new AppError(
            "Error while sending the request... try again later",
            500
          )
        );
      const result = await FriendRepository.pushRequestToSender(
        userId,
        friendId,
        sendRequest._id
      );

      if (!result)
        return next(
          new AppError(
            "Error while sending the request... try again later!",
            500
          )
        );
      return res.status(201).json({
        success: true,
        message: "Friend request sent successfully to the user..",
        sendRequest,
      });
    }
    if (reqStats.status === "pending") {
      return res.status(400).json({
        success: true,
        message:
          "Request already sent to the user. We will notify you once the user accepts your request..",
      });
    }
  });

  static respondToFriendRequest = catchAsync(async (req, res, next) => {
    const { requestId } = req.params;
    const userId = req.user.id;
    const reqStats = await FriendRepository.getRequestById(requestId);
    console.log("requestId: ", requestId, '\n', "userId: ", userId, '\n', "reqStats: ", reqStats);
    if (!reqStats)
      return next(
        new AppError("This friend request doesn't exist anymoe..", 404)
      );
    if (reqStats.status === "accepted" || reqStats.status === "rejected")
      return next(
        new AppError("You already responded to this friend request..", 400)
      );

    const acceptRequest = await FriendRepository.acceptUserRequest(
      userId,
      reqStats.receiver,
      reqStats._id,
      req.body
    );
    if (!acceptRequest)
      return next(
        new AppError(
          "Error accepting the friend request... try again later..",
          500
        )
      );
    res.status(201).json({
      success: true,
      message: "Responded to the request successfully..!",
      acceptRequest,
    });
  });
}
