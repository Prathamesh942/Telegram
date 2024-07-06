import React, { useEffect, useState } from "react";
import socket from "../../socket";
import { getUser } from "../auth/authSlice";
import { useSelector } from "react-redux";
import axios from "axios";

const Chat = () => {
  const [message, setMessage] = useState([]);
  const [mymessage, setMyMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [receiver, setReceiver] = useState(null);
  const user = useSelector(getUser);

  console.log(receiver);

  const searchUser = async (e) => {
    const response = await axios.get(`/api/v1/chat/${e.target.value}`);
    console.log(response);
    setUsers(response.data.data);
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `/api/v1/chat/${user._id}/${receiver._id}`
        );
        setMessage(response.data.data);
      } catch (error) {
        console.log("Error fetching messages:", error);
      }
    };

    if (receiver) {
      fetchMessages();
    }

    socket.on("receiveMessage", (message) => {
      if (message.sender === user._id || message.receiver === user._id) {
        setMessage((prevMessages) => [...prevMessages, message]);
      }
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [receiver, user._id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("api/v1/chat/send", {
        receiverId: receiver._id,
        message: mymessage,
      });
      socket.emit("sendMessage", {
        sender: user._id,
        receiver: receiver._id,
        message: mymessage,
      });
      setMyMessage("");
    } catch (error) {
      console.log("Error sending message:", error);
    }
  };

  return (
    <div className="flex justify-center items-center bg-zinc-800 w-screen h-screen flex-row-reverse">
      <div className="flex flex-col p-4 border rounded-lg h-[60vh] relative w-[40vw] bg-gray-900">
        <h3 className="absolute top-0 w-full bg-white left-0 right-0 rounded-lg p-2 text-center">
          {user.username}
        </h3>
        <div className="h-20 text-white flex flex-grow flex-col p-2 gap-2 mt-10 overflow-y-auto">
          {message.length > 0 ? (
            message.map((msg, index) => (
              <span key={index} className="bg-white text-black p-2 rounded-md">
                {msg.message}
              </span>
            ))
          ) : (
            <span className="text-gray-500">No messages yet</span>
          )}
        </div>
        <div className="flex mt-2">
          <input
            type="text"
            placeholder="Type here"
            onChange={(e) => setMyMessage(e.target.value)}
            value={mymessage}
            className="flex-grow p-2 rounded-l-md"
          />
          <button
            className="p-2 bg-green-600 rounded-r-md"
            onClick={handleSubmit}
          >
            Send
          </button>
        </div>
      </div>
      <div className="flex flex-col p-4 border rounded-lg h-[60vh] relative w-[40vw] bg-gray-900">
        <input type="text" placeholder="search" onChange={searchUser} />
        <div className=" flex flex-col">
          {users.map((user) => {
            return (
              <span
                className=" bg-white text-black p-2"
                onClick={() => {
                  setReceiver(user);
                }}
              >
                {user.username}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Chat;
