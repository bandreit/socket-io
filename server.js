var app = require("express")();
var http = require("http").createServer(app);
var io = require("socket.io")(http);

const { addUser, removeUser, getUser, getUsersInRoom } = require("./users.js");

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("server is up and running");
});

const users = {};

io.on("connection", (socket) => {
  socket.on("new_user", ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });

    if (error) return callback(error);

    socket.emit("message", {
      user: "admin",
      text: `${user.name}, welcome to the room ${user.room}`,
    });

    socket.broadcast
      .to(user.room)
      .emit("message", { user: "admin", text: `${user.name} has joined` });

    socket.join(user.room);

    callback();
  });

  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit("message", { user: user.name, text: message });

    callback();
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit("message", {
        user: "admin",
        text: `${user.name} has left`,
      });
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  });

  socket.on("pauseVideo", () => {
    let room = Object.keys(socket.rooms)[0];
    socket.to(room).emit("pauseVideo");
  });

  socket.on("playVideoWithTime", (currentTime) => {
    let room = Object.keys(socket.rooms)[0];
    socket.to(room).emit("playVideoWithTime", currentTime);
  });

  socket.on("playVideo", (currentTime) => {
    let room = Object.keys(socket.rooms)[0];
    socket.to(room).emit("playVideo");
  });

  socket.on("loadVideoById", (videoId) => {
    let room = Object.keys(socket.rooms)[0];
    socket.to(room).emit("loadVideoById", videoId);
  });

  socket.on("tookControll", () => {
    let room = Object.keys(socket.rooms)[0];
    console.log(room);
    socket.to(room).emit("tookControll");
  });
});

http.listen(PORT, () => {
  console.log(`listening on *: ${PORT}`);
});
