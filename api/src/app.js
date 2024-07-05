import express from "express";
import cookieParser from "cookie-parser";
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

app.get("/", (req, res) => {
  console.log("hii");
  res.json("hii");
});

export { app };
