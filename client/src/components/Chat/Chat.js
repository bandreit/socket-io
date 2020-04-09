import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import Message from "./components/Message/Message";
import { IoMdSend } from "react-icons/io";
import "./Chat.css";

let socket;

const Chat = (props) => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  //   const [infoMessage, setInfoMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const ENDPOINT = "localhost:5000";

  useEffect(() => {
    const { name, room } = props.location.state;

    socket = io(ENDPOINT);

    setName(name);
    setRoom(room);

    socket.emit("new_user", { name, room }, (error) => {
      if (error) {
        alert(error);
      }
    });

    return () => {
      socket.emit("disconnect");

      socket.off();
    };
  }, [ENDPOINT, props.location.state]);

  useEffect(() => {
    socket.on("message", (message) => {
      setMessages((messages) => [...messages, message]);
    });
  }, []);

  const sendMessage = (event) => {
    event.preventDefault();

    if (message) {
      socket.emit("sendMessage", message, () => setMessage(""));
    }
  };

  console.log(message, messages);

  return (
    <div>
      <div className="Chat-Window">
        <div className="Chat-Header">
          <div>Group Logo</div>
          <div>Group Name</div>
          <div>Group Info</div>
        </div>
        <div className="Messages-Wrapper">
          <ul className="Message-List">
            {messages.map((message, i) => (
              <Message key={i} message={message} name={name}>
                {message.text}
              </Message>
            ))}
          </ul>
        </div>
        <div className="form-wrapper">
          <input
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            onKeyPress={(event) =>
              event.key === "Enter" ? sendMessage(event) : null
            }
            type="text"
            className="text-input"
            placeholder="Write a message..."
          ></input>
          <IoMdSend className="button-input" />
        </div>
      </div>
    </div>
  );
};

export default Chat;
