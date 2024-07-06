import { useEffect, useState } from "react";
import "./App.css";
import Auth from "./pages/auth/Auth";
import axios from "axios";
import socket from "./socket.js";
import Chat from "./pages/chat/Chat.jsx";

axios.defaults.baseURL = "http://localhost:8000";
axios.defaults.withCredentials = true;

function App() {
  useEffect(() => {
    socket.on("response", (data) => {
      console.log(data);
    });
    return () => {
      socket.off("welcome");
    };
  }, []);
  return (
    <div>
      <Auth />
      <Chat />
    </div>
  );
}

export default App;
