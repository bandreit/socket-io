import React, { useState } from "react";
import { Link } from "react-router-dom";

import "./Join.css";

const Join = () => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");

  return (
    <div className="container">
      <form className="wrapper">
        <input
          className="input"
          placeholder="Name"
          type="text"
          onChange={(event) => {
            setName(event.target.value);
          }}
        ></input>{" "}
        <input
          className="input"
          placeholder="Room"
          type="text"
          onChange={(event) => {
            setRoom(event.target.value);
          }}
        ></input>{" "}
        <Link
          to={{
            pathname: "/chat",
            state: { name: name, room: room },
          }}
          onClick={(event) => (!name || !room ? event.preventDefault() : null)}
        >
          <button type="submit">Enter</button>
        </Link>
      </form>
    </div>
  );
};

export default Join;
