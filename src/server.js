import express from "express";
import http from "http";
import SocketIO from "socket.io";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const httpServer = http.createServer(app);
const io = SocketIO(httpServer);

io.on("connection", (socket) => {
  console.log(socket);
});

/*
const wss = new WebSocket.Server({ server });

const sockets = [];

const broadcastMessage = (message) => {
  sockets.forEach((o) => o?.send(message));
};

wss.on("connection", (socket) => {
  sockets.push(socket);
  socket.on("message", (message) => {
    const { type, payload } = JSON.parse(message.toString("utf8"));
    switch (type) {
      case "chat":
        broadcastMessage(`${socket.nickname}[user#${socket.id}] : ${payload}`);
        break;
      case "nickname":
        if (!socket.nickname) {
          socket.id = Math.random().toString(36).substring(7);
          broadcastMessage(`${payload}[user#${socket.id}] Connected.`);
        } else if (socket.nickname != payload) {
          broadcastMessage(
            `${socket.nickname}[user#${socket.id}] Changed the nickname to ${payload}`
          );
        }
        socket.nickname = payload;
    }
  });
  socket.on("close", () => {
    const nickname = socket.nickname;
    sockets.splice(socketIdBySocket(socket), 1);
    console.log(`[socket: server] ${nickname} closed.`);
    broadcastMessage(`${nickname}[user#${socket.id}] Disconnected.`);
  });
});
*/

const handleListen = () => console.log("Listening on http://localhost:3000");

httpServer.listen(3000, handleListen);
