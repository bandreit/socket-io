import React, { useState, useEffect, useLayoutEffect } from "react";
import io from "socket.io-client";
import Message from "./components/Message/Message";
import { IoMdSend } from "react-icons/io";
import "./Chat.css";
import GroupIcon from "@material-ui/icons/Group";
import InfoIcon from "@material-ui/icons/Info";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Modal from "@material-ui/core/Modal";

let socket;
let player;

const Chat = (props) => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [messages, setMessages] = useState([]);
<<<<<<< HEAD
  const ENDPOINT = "/";
=======
  const [videoId, setVideoId] = useState("YouTube Video ID");
  const ENDPOINT = "localhost:5000";
>>>>>>> socket-debug

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

    socket.on("message", (message) => {
      setMessages((messages) => [...messages, message]);
    });

    return () => {
      socket.emit("disconnect");
      socket.off();
    };
  }, [ENDPOINT, props.location.state]);

  useEffect(() => {
    socket.on("pauseVideo", () => {
      if (player.getPlayerState) {
        let videoStatus = player.getPlayerState();
        if (videoStatus !== 2) player.pauseVideo();
      }
    });

    socket.on("playVideoWithTime", (currentTime) => {
      if (player.getPlayerState) {
        let videoStatus = player.getPlayerState();
        if (
          videoStatus === 2 ||
          videoStatus === -1 ||
          videoStatus === 1 ||
          videoStatus === 5
        ) {
          player.playVideo();
          player.seekTo(currentTime, true);
        }
      }
    });

    socket.on("playVideo", () => {
      if (player.getPlayerState) {
        let videoStatus = player.getPlayerState();
        if (videoStatus === 2 || videoStatus === -1 || videoStatus === 1) {
          player.playVideo();
        }
      }
    });

    socket.on("loadVideoById", (videoId) => {
      if (player && player.hasOwnProperty("loadVideoById"))
        player.loadVideoById(videoId, 0);
    });

    socket.on("roomData", (data) => {
      // console.log();
      setUsers(data.users.map((x) => x.name));
    });
  }, []);

  const sendMessage = (event) => {
    event.preventDefault();
    if (message) {
      socket.emit("sendMessage", message, () => setMessage(""));
    }
  };

  useLayoutEffect(() => {
    const onPlayerReady = (event) => {
      // event.target.playVideo();
    };

    const onPlayerStateChange = (event) => {
      if (name !== "controller") return;
      let playerState = event.data;
      if (playerState === 2) {
        pauseVideo();
      }
      if (playerState === 1 || playerState === 3) {
        if (event.target.getCurrentTime) {
          playVideoWithTime(event.target.getCurrentTime());
        } else {
          playVideo();
        }
      }
    };

    const loadPlayer = () => {
      if (!window.YT.Player) {
      } else {
        player = new window.YT.Player(`player`, {
          videoId: "Md0RjxyoYyU",
          playerVars: {
            controls: 1,
            loop: 1,
            mute: 1,
          },
          host: "https://www.youtube.com",
          events: {
            onReady: onPlayerReady,
            onStateChange: onPlayerStateChange,
          },
        });
      }
    };

    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      window.onYouTubeIframeAPIReady = loadPlayer;
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    } else {
      loadPlayer();
    }
  }, [name]);

  const changeVideoID = (event) => {
    event.preventDefault();
    if (name === "controller") {
      socket.emit("loadVideoById", videoId);
      if (player && player.hasOwnProperty("loadVideoById"))
        player.loadVideoById(videoId, 0);
    }
  };

  const pauseVideo = () => {
    socket.emit("pauseVideo");
  };

  const playVideoWithTime = (time) => {
    socket.emit("playVideoWithTime", time);
  };

  const playVideo = () => {
    socket.emit("playVideo");
  };

  const handleOpen = () => {
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
  };

  return (
    <div className="full-container">
      <div className="form-video-wrapper">
        <div className="videoWrapper">
          <div id="player"></div>
        </div>
        <div className="video-id-button">
          <form onSubmit={changeVideoID}>
            <TextField
              value={videoId}
              onChange={(event) => setVideoId(event.target.value)}
              type="text"
              placeholder="Video ID..."
            ></TextField>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              style={{ marginLeft: 30 }}
            >
              Change It
            </Button>
          </form>
        </div>
      </div>
      <div className="Chat-Window">
        <div className="Chat-Header">
          <div>
            <GroupIcon fontSize="large" />
            {users.length}
          </div>
          <div>Room {room}</div>
          <InfoIcon fontSize="large" onClick={handleOpen} />
          <Modal
            open={modalOpen}
            onClose={handleClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            className="modal"
          >
            <div className="inside-modal">
              <h2>Online users:</h2>
              <div>
                {users.map((user) => {
                  return (
                    <h4 style={{ padding: 10 }} key={user}>
                      {user}
                    </h4>
                  );
                })}
              </div>
            </div>
          </Modal>
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
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            onKeyPress={(event) =>
              event.key === "Enter" ? sendMessage(event) : null
            }
            type="text"
            className="text-input"
            placeholder="Write a message..."
          ></textarea>
          <IoMdSend className="button-input" />
        </div>
      </div>
    </div>
  );
};

export default Chat;
