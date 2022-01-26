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
    const nickname = sockets[index]?.nickname;
    const { type, payload } = JSON.parse(msg);
    if (type == "chat") {
      broadcastMessage(`${nickname}[user#${index}] : ${payload}`);
    }
    if (type == "nickname") {
      if (nickname != payload) {
        if (index >= 0) {
          sockets[index].nickname = payload;
          broadcastMessage(
            `${nickname}[user#${index}] Changed the nickname to ${payload}`
          );
        } else {
          sockets.push({ nickname: payload, socket: socket });
          broadcastMessage(`${payload}[user#${sockets.length - 1}] Connected!`);
        }
      }
    }
  });
  socket.on("close", () => {
    const index = socketIdBySocket(socket);
    const nickname = sockets[index]?.nickname;
    sockets[index] = null;
    console.log(`[socket: server] ${nickname} closed.`);
    broadcastMessage(`${nickname}[user#${index}] Disconnected.`);
  });
});

wss.on("listening", (socket) => {
  console.log(socket);
});

server.listen(3000, handleListen);
