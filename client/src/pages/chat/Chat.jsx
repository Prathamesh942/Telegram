import React, { useEffect, useRef, useState } from "react";
import socket from "../../socket";
import { getUser } from "../auth/authSlice";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../App.css";
import SearchInput from "../../components/SearchInput";

const Chat = () => {
  const [message, setMessage] = useState([]);
  const [mymessage, setMyMessage] = useState();
  const [contacts, setContacts] = useState([]);
  const [receiver, setReceiver] = useState();
  const [searchResult, setSearchResult] = useState([]);
  const [searching, setSearching] = useState(false);
  const [status, setStatus] = useState();
  const user = useSelector(getUser);
  const navigate = useNavigate();
  const messagesBoxRef = useRef();

  console.log(receiver);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  const searchUser = async (e) => {
    try {
      const response = await axios.get(`/api/v1/chat/user/${e.target.value}`);
      console.log(response);
      setSearchResult(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchContacts = async () => {
      const res = await axios.get("/api/v1/chat/contacts");
      console.log(res.data.data);
      setContacts(res.data.data);
    };
    const fetchMessages = async () => {
      try {
        console.log(user._id, receiver._id);
        const response = await axios.get(
          `/api/v1/chat/message/${user._id}/${receiver._id}`
        );
        console.log(response);
        setMessage(response.data.data);
      } catch (error) {
        console.log(error);
        console.log("Error fetching messages:", error);
      }
    };
    fetchContacts();
    if (receiver) {
      fetchMessages();
      const fetchStatus = async () => {
        try {
          const response = await axios.get(
            `/api/v1/chat/user-status/${receiver._id}`
          );
          console.log(response.data);
          setStatus(response.data);
        } catch (error) {
          console.log(error);
        }
      };
      fetchStatus();
    }

    socket.on("receiveMessage", (message) => {
      console.log("New message");
      if (message.sender === user._id || message.receiver === user._id) {
        setMessage((prevMessages) => [...prevMessages, message]);
      }
    });

    socket.emit("user-online", user._id);

    return () => {
      socket.disconnect();
      socket.off("receiveMessage");
    };
  }, [receiver, user?._id, mymessage]);

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

  useEffect(() => {
    const div = messagesBoxRef.current;
    if (div) {
      div.scrollIntoView({ behavior: "smooth" });
    }
  }, [message]);

  console.log(status);

  return (
    <div className=" flex justify-center items-center w-screen h-screen bg-[#111111] select-none">
      <div className="flex justify-center items-center bg-zinc-900 w-screen h-screen flex-row-reverse rounded-xl">
        {receiver ? (
          <div className="flex flex-col p-8 px-[6vw] relative h-[100%] flex-[2] ">
            <h3 className="  rounded-lg p-2 text-3xl font-semibold text-white flex items-center gap-5">
              <img
                className=" size-[80px] rounded-full"
                src={
                  receiver?.contact?.profileImg ||
                  "https://cdn3d.iconscout.com/3d/premium/thumb/user-5115591-4280969.png?f=webp"
                }
                alt=""
              />
              <div className=" flex flex-col">
                <span>{receiver?.contact?.username}</span>

                <span className=" text-base font-light text-zinc-300">
                  {status?.online
                    ? "🟢 online"
                    : `Last seen ${minutesPast(status?.lastSeen)}m ago`}
                </span>
              </div>
            </h3>
            <div className="h-20 text-white flex flex-grow flex-col p-2 gap-2 mt-10 overflow-y-auto  hide-scrollbar stiky bottom-0">
              {message.length > 0 ? (
                message.map((msg, index) => (
                  <div
                    key={index}
                    className={`p-2 rounded-md text-base max-w-xs break-words ${
                      msg?.receiver != user._id
                        ? " bg-indigo-800 self-end"
                        : "bg-zinc-800 self-start"
                    }`}
                  >
                    {msg?.message}
                  </div>
                ))
              ) : (
                <span className="text-gray-500">No messages yet</span>
              )}
              <div ref={messagesBoxRef}></div>
            </div>
            <div className="flex mt-2">
              <input
                type="text"
                placeholder="Type here"
                onChange={(e) => setMyMessage(e.target.value)}
                value={mymessage}
                className="flex-grow p-2 rounded-l-md bg-transparent text-white outline-none"
                onKeyDown={(e) => {
                  console.log("hi");
                  if (e.key === "Enter") {
                    handleSubmit(e);
                  }
                }}
              />
              <button
                className="p-2 bg-white rounded-r-md"
                onClick={handleSubmit}
              >
                Send
              </button>
            </div>
          </div>
        ) : (
          <div className=" flex justify-center items-center flex-[2]">
            <h3 className=" text-white text-xl bg-zinc-700 rounded-2xl p-2">
              Select chat to start messaging
            </h3>
          </div>
        )}
        <div className="flex flex-col p-8  relative flex-1 min-w-[400px] h-[100%] gap-5 bg-zinc-800">
          <SearchInput searchUser={searchUser} setSearching={setSearching} />
          <div className=" flex flex-col gap-2">
            {searching ? (
              <>
                {searchResult.map((user, index) => {
                  console.log(user);
                  return (
                    <div
                      key={user._id || index}
                      className="p-2 flex gap-2 text-xl text-white"
                      onClick={() => {
                        console.log(user);
                        setReceiver(user);
                        console.log("Receiver set to:", user);
                        setSearchResult([]);
                        setSearching(false);
                      }}
                    >
                      <img
                        src={
                          user?.profileImg ||
                          "https://cdn3d.iconscout.com/3d/premium/thumb/user-5115591-4280969.png?f=webp"
                        }
                        alt=""
                        className="rounded-xl size-[60px] object-cover"
                      />
                      <div className="flex flex-col">
                        <span>{user?.username}</span>
                        <span className="text-base text-zinc-500">
                          {user?.recentMessage?.message}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </>
            ) : (
              <>
                {contacts.map((user) => {
                  return (
                    <div
                      className="p-2 flex gap-2 text-xl text-white"
                      onClick={() => {
                        setReceiver(user.contact);
                      }}
                    >
                      <img
                        src={
                          user?.contact?.profileImg ||
                          "https://cdn3d.iconscout.com/3d/premium/thumb/user-5115591-4280969.png?f=webp"
                        }
                        alt=""
                        className=" rounded-xl size-[60px] object-cover"
                      />
                      <div className=" flex flex-col">
                        <span>{user?.contact?.username}</span>
                        <span className=" text-base text-zinc-500">
                          {user?.recentMessage?.message}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

function minutesPast(lastSeenTimestamp) {
  const now = new Date();
  const lastSeen = new Date(lastSeenTimestamp);

  const differenceInMs = now - lastSeen;
  const minutesPast = Math.floor(differenceInMs / 1000 / 60);

  return minutesPast;
}

export default Chat;
