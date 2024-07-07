import React, { useEffect, useState } from "react";
import socket from "../../socket";
import { getUser } from "../auth/authSlice";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Chat = () => {
  const [message, setMessage] = useState([
    { m: "Hii Cutie 🎀", s: true },
    { m: "Hellow 😽", s: false },
    { m: "what are you doing?", s: true },
    { m: "lying on bed ", s: false },
    { m: "ME TOO", s: true },
    { m: "LOL 😆", s: false },
    { m: "What", s: true },
    { m: "😈", s: false },
  ]);
  const [mymessage, setMyMessage] = useState();
  const [users, setUsers] = useState([
    {
      p: "https://i.pinimg.com/564x/cc/d3/5f/ccd35f88f9fa8bcfb486b0fd0f5e4372.jpg",
      name: "Prathamesh",
      rm: "Hey Babe",
    },
    {
      p: "https://i.pinimg.com/564x/5b/06/32/5b063215d32ed854d53422b26ea76965.jpg",
      name: "Prathamesh",
      rm: "Hey Babe",
    },
    {
      p: "https://i.pinimg.com/564x/c7/89/2d/c7892dcd8e09ae74d728089a86c721ad.jpg",
      name: "Prathamesh",
      rm: "Hey Babe",
    },
  ]);
  const [receiver, setReceiver] = useState(null);
  const user = useSelector(getUser);
  const navigate = useNavigate();

  useEffect(() => {
    console.log(user);
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

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
  }, [receiver, user?._id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("api/v1/chat/send", {
        receiverId: receiver?._id,
        message: mymessage,
      });
      socket.emit("sendMessage", {
        sender: user?._id,
        receiver: receiver?._id,
        message: mymessage,
      });
      setMyMessage("");
    } catch (error) {
      console.log("Error sending message:", error);
    }
  };

  return (
    <div className=" flex justify-center items-center w-screen h-screen bg-[#111111]">
      <div className="flex justify-center items-center bg-[#1a1a1a] w-screen h-screen flex-row-reverse rounded-xl">
        <div className="flex flex-col p-8 px-[6vw] relative h-[100%] flex-[2]">
          <h3 className="  rounded-lg p-2 text-3xl font-semibold text-white flex items-center gap-5">
            <img
              className=" size-[80px] rounded-full"
              src="https://i.pinimg.com/564x/cc/d3/5f/ccd35f88f9fa8bcfb486b0fd0f5e4372.jpg"
              alt=""
            />
            <div className=" flex flex-col">
              <span>Prathamesh</span>
              <span className=" text-base font-light text-zinc-300">
                Last seen 18 mins ago
              </span>
            </div>
          </h3>
          <div className="h-20 text-white flex flex-grow flex-col p-2 gap-2 mt-10 overflow-y-auto">
            {message.length > 0 ? (
              message.map((msg, index) => (
                <div
                  key={index}
                  className={`p-2 rounded-md text-base max-w-xs break-words ${
                    msg.s ? " bg-indigo-800 self-end" : "bg-zinc-800 self-start"
                  }`}
                >
                  {msg?.m}
                </div>
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
              className="flex-grow p-2 rounded-l-md bg-transparent"
            />
            <button
              className="p-2 bg-white rounded-r-md"
              onClick={handleSubmit}
            >
              Send
            </button>
          </div>
        </div>
        <div className="flex flex-col p-8  relative flex-1 min-w-[400px] h-[100%] gap-5">
          <input
            type="text"
            placeholder="search"
            className=" p-3 py-4 rounded-xl bg-zinc-800"
            onChange={searchUser}
          />
          <div className=" flex flex-col gap-2">
            {users.map((user) => {
              return (
                <div
                  className="p-2 flex gap-2 text-xl text-white"
                  onClick={() => {
                    setReceiver(user);
                  }}
                >
                  <img
                    src={user?.p}
                    alt=""
                    className=" rounded-xl size-[60px] object-cover"
                  />
                  <div className=" flex flex-col">
                    <span>{user?.name}</span>
                    <span className=" text-base text-zinc-500">{user?.rm}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
