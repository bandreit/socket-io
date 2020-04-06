var app = require("express")();
var http = require("http").createServer(app);
var io = require("socket.io")(http);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

const users = {};

io.on("connection", (socket) => {
  socket.on("new_user", (name) => {
    users[socket.id] = name;
    socket.broadcast.emit("user_connected", name);
  });

  socket.on("list_users", () => {
    console.log(users);
    io.to(`${socket.id}`).emit("list_users", users);
  });

  socket.on("disconnect", () => {
    delete users[socket.id];
    console.log("user disconnected");
  });

  socket.on("chat_message", (msg) => {
    io.emit("chat_message", msg);
  });
});

http.listen(5000, () => {
  console.log("listening on *:5000");
});
