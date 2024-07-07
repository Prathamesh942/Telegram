import { Router } from "express";
import {
  sendMessage,
  getMessage,
  searchUser,
  getContacts,
  deleteMessage,
} from "../controller/message.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { UserStatus } from "../models/userstatus.model.js";

const router = Router();

router.route("/send").post(verifyJwt, sendMessage);
router.route("/message/:senderId/:receiverId").get(verifyJwt, getMessage);
router.route("/user/:username").get(verifyJwt, searchUser);
router.route("/contacts").get(verifyJwt, getContacts);
router.route("/message/delete").delete(verifyJwt, deleteMessage);
router.route("/user-status/:userId").get(async (req, res) => {
  const { userId } = req.params;
  console.log("userid is", userId);
  const userStatus = await UserStatus.findOne({ userId });
  console.log(userStatus);
  if (userStatus) {
    console.log(userStatus);
    res.json(userStatus);
  } else {
    res.status(404).send("User not found");
  }
});
export default router;
