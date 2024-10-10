import { Friend } from "./friends-model.js";
import { User } from "../users/users-model.js";
import UserRepository from "../users/users-repository.js";

export default class FriendRepository {
  static getFriendsByUser = async (userId) => {
    return await UserRepository.getUserFriends(userId);
  };

  static sendRequestToUser = async (userId, friendId) => {
    return await Friend.create({ sender: userId, receiver: friendId });
  };

  static getPendingRequests = async (userId) => {
    return await UserRepository.getPendingRequests(userId);
  };

  static getRequestStatus = async (userId, friendId) => {
    return await Friend.findOne({ sender: userId, receiver: friendId });
  };

  static getRequestById = async (requestId) => {
    return await Friend.findById(requestId);
  };

  static pushRequestToSender = async (userId, friendId, requestId) => {
    const sender = await User.findByIdAndUpdate(userId, {
      $push: { outgoingRequest: requestId },
    });
    if (!sender) return false;
    const receiver = await User.findByIdAndUpdate(friendId, {
      $push: { incomingRequest: requestId },
    });
    if (!receiver) return false;
    return true;
  };

  static acceptUserRequest = async (userId, friendId, requestId, action) => {
    const friendRequest = await Friend.findByIdAndUpdate(requestId, action, {
      new: true,
      runValidators: true,
    });
    if (!friendRequest) return false;

    if (friendRequest.status === "accepted") {
      const sender = await User.findByIdAndUpdate(friendRequest.sender, {
        $push: { friends: friendRequest.receiver },
        $pull: { outgoingRequest: friendRequest._id }
      });
      if (!sender) return false;
      const receiver = await User.findByIdAndUpdate(friendRequest.receiver, {
        $push: { friends: friendRequest.sender },
        $pull: { incomingRequest: friendRequest._id },
      });
      if(!receiver) return false;
      return friendRequest;
    }

    if (friendRequest.status === "rejected") {
      const deleteStatus = await Friend.findByIdAndDelete(requestId);
      if (!deleteStatus) return false;
      const sender = await User.findByIdAndUpdate(friendRequest.sender, {
        $pull: { outgoingRequest: friendRequest._id },
      });
      if (!sender) return false;
      const receiver = await User.findByIdAndUpdate(friendRequest.receiver, {
        $pull: { incomingRequest: friendRequest._id },
      });
      return deleteStatus;
    }
  };
}
