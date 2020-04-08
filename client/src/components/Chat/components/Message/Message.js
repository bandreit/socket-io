import React from "react";
import "./Message.css";

const isSameUser = false;

const Message = ({ message: { user, text }, name }) => {
  if (user === name) {
    return <li className="sent">{text}</li>;
  } else return <li>{text}</li>;
};

export default Message;

//  <li className="received">
//               un mesaj mesaj pfeafe faeafa aaote cea mai lung mesaj paote cea
//               mai lung mesaj paote cea mai lung mesaj afefea fe paote cea mai
//               lung paote cea mai lungfeffefefefee
//               <div className="time">10:10</div>
//             </li>
