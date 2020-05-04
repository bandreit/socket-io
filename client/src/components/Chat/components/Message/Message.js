import React from "react";
import "./Message.css";

// const isSameUser = false;

const Message = ({ message: { user, text }, name }) => {
  return user === name.trim().toLowerCase() ? (
    <li className="sent">{text}</li>
  ) : user === "admin" ? (
    <div className="notification">{text}</div>
  ) : (
    <li>{text}</li>
  );
};

export default Message;
