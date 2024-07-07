import mongoose from "mongoose";

const userStatusSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  online: { type: Boolean, default: false },
  lastSeen: { type: Date, default: Date.now },
});

export const UserStatus = mongoose.model("UserStatus", userStatusSchema);
