import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import cors from "cors";

const app = express();
app.use(cookieParser());

app.use(
  cors({
    origin: "https://localhost:3000",
    credentials: true,
    exposedHeaders: ["Set-Cookie"],
  })
);

app.use(bodyParser.json());

app.get("/", (req, res) => {
  console.log("hii");
  res.json("hii");
});

app.use("/api/v1/auth", authRouter);

export { app };
