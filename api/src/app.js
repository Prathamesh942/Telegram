import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import chatRouter from "./routes/message.route.js";
import cors from "cors";
import cookie from "cookie";
import http from "http";
import jwt from "jsonwebtoken";
import { Server } from "socket.io";
import { UserStatus } from "./models/userstatus.model.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.use((socket, next) => {
  const cookies = cookie.parse(socket.handshake.headers.cookie || "");
  const token = cookies.accessToken;
  if (token) {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return next(new Error("Authentication error"));
      }
      socket.user = decoded;
      next();
    });
  } else {
    next(new Error("Authentication error"));
  }
});

io.on("connection", (socket) => {
  console.log("New client connected:", socket.user);

  socket.on("user-online", async (userId) => {
    await UserStatus.findOneAndUpdate(
      { userId },
      { online: true, lastSeen: new Date() },
      { upsert: true }
    );
  });

  socket.on("sendMessage", (msg) => {
    io.emit("receiveMessage", msg);
  });

  socket.on("disconnect", async () => {
    const userId = socket.user._id;
    console.log("Client disconnected", userId);
    await UserStatus.findOneAndUpdate(
      { userId },
      { online: false, lastSeen: new Date() }
    );
  });
});

app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    exposedHeaders: ["Set-Cookie"],
  })
);

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.json("hii");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/chat", chatRouter);

export { server };
