import { Router } from "express";
import {
  sendMessage,
  getMessage,
  searchUser,
} from "../controller/message.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/send").post(verifyJwt, sendMessage);
router.route("/:senderId/:receiverId").get(verifyJwt, getMessage);
router.route("/:username").get(verifyJwt, searchUser);
export default router;
