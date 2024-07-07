import { useEffect, useState } from "react";
import "./App.css";
import Auth from "./pages/auth/Auth";
import axios from "axios";
import socket from "./socket.js";
import Chat from "./pages/chat/Chat.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Chat />,
  },
  {
    path: "/auth",
    element: <Auth />,
  },
]);

axios.defaults.baseURL = "https://telegram-mmwc.onrender.com";
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
  return <RouterProvider router={router} />;
}

export default App;
