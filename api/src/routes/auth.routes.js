import { Router } from "express";
import {
  loginUser,
  registerUser,
  logoutUser,
} from "../controller/auth.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJwt, logoutUser);
router.route("/checkauth").get(verifyJwt, (req, res) => {
  res.status(200).json({ loggedIn: true });
});

export default router;
