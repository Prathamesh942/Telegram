import React, { useEffect, useState } from "react";
import socket from "../../socket";

const Chat = () => {
  const [message, setMessage] = useState([]);
  const [mymessage, setMyMessage] = useState("");

  useEffect(() => {
    socket.on("newMessage", (newMessage) => {
      console.log("newmessage", newMessage);
      setMessage((prevMessages) => [...prevMessages, newMessage]);
      console.log(message);
    });
    return () => {
      socket.off("newMessage", {});
    };
  }, []);

  const handleSubmit = () => {
    socket.emit("newMessage", mymessage);
    setMyMessage("");
  };
  return (
    <div className=" flex justify-center items-center bg-zinc-800 w-screen h-screen">
      <div className=" flex flex-col p-4 border rounded-lg h-[60vh]">
        <div className="  h-20 text-white flex flex-grow flex-col p-2">
          {message.map((msg) => (
            <span className=" bg-white text-black p-2">{msg}</span>
          ))}
        </div>
        <div>
          <input
            type="text"
            placeholder="Type here"
            onChange={(e) => {
              setMyMessage(e.target.value);
            }}
            value={mymessage}
            className=" p-2"
          />
          <button className=" p-2 bg-green-600" onClick={handleSubmit}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
