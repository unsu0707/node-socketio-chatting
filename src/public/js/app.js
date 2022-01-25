const socket = new WebSocket(`ws://${window.location.host}`);

socket.addEventListener("open", () => {
  console.log("[socket: frontend] Opened!");
});

socket.addEventListener("message", (message) => {
  console.log(
    "[socket: frontend] '",
    message.data,
    "' is arrived from the server."
  );
});

socket.addEventListener("close", () => {
  console.log("[socket: frontend] Closed!");
});
