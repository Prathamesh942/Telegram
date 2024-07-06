import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Message } from "../models/message.model.js";
import { User } from "../models/user.model.js";

const sendMessage = asyncHandler(async (req, res) => {
  try {
    const user = req.user;
    const senderId = user._id;
    const { receiverId, message } = req.body;
    const newMessage = new Message({
      sender: senderId,
      receiver: receiverId,
      message,
    });
    await newMessage.save();
    res.status(200).send(new ApiResponse(200, newMessage, "sent"));
  } catch (error) {
    throw new ApiError(500, "Failed to send message");
  }
});

const getMessage = asyncHandler(async (req, res) => {
  try {
    const { senderId, receiverId } = req.params;
    console.log(senderId, receiverId);
    const messages = await Message.find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    }).sort({ timestamp: 1 });
    res.status(200).send(new ApiResponse(200, messages, "fetched"));
  } catch (error) {
    console.log(error);
    throw new ApiError(500, "Failed to fetch messages");
  }
});

const searchUser = asyncHandler(async (req, res) => {
  try {
    const { username } = req.params;
    const users = await User.find({ username });
    console.log(users);
    res.status(200).json(new ApiResponse(200, users, "user fetched"));
  } catch (error) {
    throw new ApiError(404, "user not found");
  }
});

export { sendMessage, getMessage, searchUser };
