import express from "express";
import http from "http";
import WebSocket from "ws";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const handleListen = () => console.log("Listening on http://localhost:3000");

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const sockets = [];

const broadcastMessage = (message, destination = null) => {
  sockets.forEach((o) => o?.socket.send(message));
};

const socketIdBySocket = (socket) => {
  return sockets.findIndex((e) => e?.socket == socket);
};

wss.on("connection", (socket) => {
  socket.on("message", (message) => {
    const msg = message.toString("utf8");
    console.log(msg);
    const index = socketIdBySocket(socket);
    const originalNickname = sockets[index]?.nickname;
    const { nickname, chat } = JSON.parse(msg);
    if (originalNickname != nickname) {
      if (index >= 0) {
        sockets[index].nickname = nickname;
        broadcastMessage(
          `${originalNickname}[user#${index}] changed the nickname to ${nickname}`
        );
      } else {
        sockets.push({ nickname: nickname, socket: socket });
        broadcastMessage(`${nickname}[user#${sockets.length - 1}] connected!`);
      }
    }
    if (chat) {
      broadcastMessage(`${nickname}[user#${index}] : ${chat}`);
    }
  });
  socket.on("close", () => {
    const index = socketIdBySocket(socket);
    const nickname = sockets[index]?.nickname;
    sockets[index] = null;
    console.log(`[socket: server] ${nickname} closed.`);
    broadcastMessage(`${nickname}[user#${index}] disconnected.`);
  });
});

wss.on("listening", (socket) => {
  console.log(socket);
});

server.listen(3000, handleListen);
