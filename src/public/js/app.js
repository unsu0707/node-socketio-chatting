const messageList = document.querySelector("ul");
const nameForm = document.querySelector("form#nameForm");
const messageForm = document.querySelector("form#chatForm");
messageForm.hidden = true;
const nickname = document.querySelector("input#nameInput");
const nameBtn = nameForm.querySelector("button#nameBtn");

var socket;
var socketId;

const jsonPayload = (type, payload) => {
  return JSON.stringify({ type, payload });
};

const addChatHistory = (message) => {
  const li = document.createElement("li");
  li.innerText = message;
  messageList.append(li);
};

const handleNameFormSubmit = (event) => {
  event.preventDefault();
  if (!socket) {
    socket = new WebSocket(`ws://${window.location.host}`);
    socket.addEventListener("open", () => {
      console.log("[socket: frontend] Opened!");
      socket.send(jsonPayload("nickname", nickname.value));
      nameBtn.innerHTML = "Save";
      messageForm.hidden = false;
    });

    socket.addEventListener("message", (message) => {
      addChatHistory(message.data);
    });

    socket.addEventListener("close", () => {
      console.log("[socket: frontend] Closed!");
      socket = null;
      nameBtn.innerHTML = "Enter";
      messageForm.hidden = true;
      addChatHistory("Server is Closed.");
    });
  } else {
    socket.send(jsonPayload("nickname", nickname.value));
  }
};

nameForm.addEventListener("submit", handleNameFormSubmit);

const handleSubmit = (event) => {
  event.preventDefault();
  const input = messageForm.querySelector("input#chatInput");
  socket.send(jsonPayload("chat", input.value));
  input.value = "";
};

messageForm.addEventListener("submit", handleSubmit);
