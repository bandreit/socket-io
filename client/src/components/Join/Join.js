import React, { useState } from "react";
import { Link } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";

import "./Join.css";

const Join = () => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");

  return (
    <div className="container">
      <form className="wrapper">
        <TextField
          className="input"
          label="Name"
          variant="outlined"
          type="text"
          onChange={(event) => {
            setName(event.target.value);
          }}
        ></TextField>
        <Box m={1} />
        <TextField
          className="input"
          label="Room"
          variant="outlined"
          type="text"
          onChange={(event) => {
            setRoom(event.target.value);
          }}
        ></TextField>{" "}
        <Box m={1} />
        <Link
          to={{
            pathname: `/room/${room}`,
            state: { name: name, room: room },
          }}
          onClick={(event) => (!name || !room ? event.preventDefault() : null)}
          className="button"
        >
          <Button
            variant="contained"
            color="primary"
            size="large"
            type="submit"
          >
            Enter
          </Button>
        </Link>
      </form>
    </div>
  );
};

export default Join;
