const socket = io();
const welcome = document.querySelector("div#welcome");
const roomForm = welcome.querySelector("form");
const chat = document.querySelector("div#chat");
const chatForm = chat.querySelector("form");

chat.hidden = true;

let roomName = "";
let nickname = "";

socket.on("connect", () => {
  console.log(socket.id);
});

socket.onAny((event) => {
  console.log(event);
});

socket.on("get_message", (message) => {
  addChatHistory(message);
});

const addChatHistory = (message) => {
  const ul = chat.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.append(li);
};

const enterRoom = (userCount) => {
  welcome.hidden = true;
  chat.hidden = false;
  const h3 = chat.querySelector("h3");
  h3.innerText = `Room ${roomName} (${userCount})`;
};

const handleRoomSubmit = (event) => {
  event.preventDefault();
  roomName = roomForm.querySelector("input#roomname").value;
  nickname = roomForm.querySelector("input#nickname").value;
  socket.emit("enter_room", roomName, nickname, enterRoom);
};

const handleChatSubmit = (event) => {
  event.preventDefault();
  const input = chatForm.querySelector("input");
  const message = input.value;
  socket.emit("send_message", message, roomName, () => {
    addChatHistory(`You: ${message}`);
    input.value = "";
  });
};

socket.on("room_change", (rooms) => {
  const ul = welcome.querySelector("ul");
  ul.innerHTML = "";
  rooms.forEach((room) => {
    const li = document.createElement("li");
    li.innerText = `${room.roomName} (${room.userCount})`;
    ul.append(li);
  });
});

chatForm.addEventListener("submit", handleChatSubmit);
roomForm.addEventListener("submit", handleRoomSubmit);
