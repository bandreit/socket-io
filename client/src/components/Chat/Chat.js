import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import Message from "./components/Message/Message";
import { IoMdSend } from "react-icons/io";
import "./Chat.css";

let socket;
let player;

const Chat = (props) => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const ENDPOINT = "/";

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
        console.log("STOP");
        if (videoStatus !== 2) player.pauseVideo();
      }
    });
    socket.on("playVideoWithTime", (currentTime) => {
      console.log("PLAY ", currentTime);
      if (player.getPlayerState) {
        let videoStatus = player.getPlayerState();
        console.log("PLAY INSIDE");
        if (videoStatus === 2 || videoStatus === -1 || videoStatus === 1) {
          player.seekTo(currentTime, true);
          player.playVideo();
        }
      }
      // player.playVideo();
    });
    socket.on("playVideo", () => {
      console.log("PLAY NO TIME");
      if (player.getPlayerState) {
        let videoStatus = player.getPlayerState();
        console.log("PLAY INSIDE");
        if (videoStatus === 2 || videoStatus === -1 || videoStatus === 1) {
          player.playVideo();
        }
      }
      // player.playVideo();
    });
  }, []);

  const sendMessage = (event) => {
    event.preventDefault();

    // player.pauseVideo();
    // pauseVideo();
    // console.log(player);

    if (message) {
      socket.emit("sendMessage", message, () => setMessage(""));
    }
  };

  const onPlayerReady = (event) => {
    event.target.playVideo();
  };

  const onPlayerStateChange = (event) => {
    if (name !== "controller") return;
    let playerState = event.data;
    if (playerState === 2) {
      console.log("paused");
      pauseVideo();
    }
    if (playerState === 1 || playerState === 3) {
      if (event.target.getCurrentTime) {
        playVideoWithTime(event.target.getCurrentTime());
      } else {
        playVideo();
      }
      console.log("played");
    }
    if (playerState === -1) console.log("unstarted");
  };

  const loadPlayer = () => {
    if (!window.YT.Player) {
      console.log("does not exist");
    } else {
      console.log("apelat ampulea");
      player = new window.YT.Player(`player`, {
        videoId: "JNhiy0sTl5M",
        playerVars: {
          controls: 1,
          loop: 1,
          mute: 1,
        },
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange,
        },
      });
    }
  };

  useEffect(() => {
    if (!window.YT) {
      // If not, load the script asynchronously
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      // onYouTubeIframeAPIReady will load the video after the script is loaded
      window.onYouTubeIframeAPIReady = loadPlayer;
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    } else {
      loadPlayer();
      console.log("WHAT THE FUCK");
    }
    // the Player object is created uniquely based on the id in props
  });

  const pauseVideo = () => {
    socket.emit("pauseVideo");
  };

  const playVideoWithTime = (time) => {
    socket.emit("playVideoWithTime", time);
  };

  const playVideo = () => {
    socket.emit("playVideo");
  };

  return (
    <div className="full-container">
      <div id="player"></div>
      <div className="Chat-Window">
        <div className="Chat-Header">
          <div>Group Logo</div>
          <div>Room {room}</div>
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
