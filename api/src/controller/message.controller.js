import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Message } from "../models/message.model.js";
import { User } from "../models/user.model.js";

const addToContacts = async (userId1, userId2) => {
  const user1 = await User.findById(userId1);
  const user2 = await User.findById(userId2);

  console.log(user1, user2);

  if (!user1?.contacts?.includes(userId2)) {
    user1?.contacts.push(userId2);
    await user1.save();
  }

  if (!user2?.contacts?.includes(userId1)) {
    user2?.contacts.push(userId1);
    await user2.save();
  }
};

const sendMessage = asyncHandler(async (req, res) => {
  try {
    const user = req.user;
    const senderId = user._id;
    console.log(req.body);
    const { receiverId, message } = req.body;
    await addToContacts(senderId, receiverId);
    const newMessage = new Message({
      sender: senderId,
      receiver: receiverId,
      message,
    });
    await newMessage.save();
    res.status(200).send(new ApiResponse(200, newMessage, "sent"));
  } catch (error) {
    console.log(error);
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

const deleteMessage = asyncHandler(async (req, res) => {
  const msg = Message.findById(req.body.msg._id);
  if (!msg) {
    throw new ApiError(404, "message not found");
  }
  await msg.deleteOne();
  return res.status(200).json(new ApiResponse(200, null, "message deleted"));
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

const getContacts = asyncHandler(async (req, res) => {
  try {
    const me = req.user;

    const contacts = await User.findById(me._id).select("contacts").populate({
      path: "contacts",
      select: "username email profileImg",
    });

    if (!contacts) {
      throw new ApiError(404, "contacts not found");
    }
    const contactsWithMessages = await Promise.all(
      contacts.contacts.map(async (contact) => {
        const recentMessage = await Message.findOne({
          $or: [
            { sender: me._id, receiver: contact._id },
            { sender: contact._id, receiver: me._id },
          ],
        })
          .sort({ createdAt: -1 })
          .select("message sender receiver createdAt");

        return {
          contact,
          recentMessage,
        };
      })
    );

    res
      .status(200)
      .json(new ApiResponse(200, contactsWithMessages, "contacts fetched"));
  } catch (error) {
    console.error("Error fetching contacts:", error);
    throw new ApiError(500, "Failed to fetch contacts");
  }
});

export { sendMessage, getMessage, searchUser, getContacts, deleteMessage };
