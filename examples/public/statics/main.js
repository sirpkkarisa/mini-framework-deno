(() => {
  const socket = new WebSocket(`ws://${location.host}/chat`);

  socket.onopen = () => {
    console.log("Connection established! ", Date.now());
  };

  socket.onmessage = (message) => {
    message = JSON.parse(message.data);
    switch (message.event.type) {
      case "user-connected":
        console.log(message);
        socket.send(JSON.stringify({
          event: {
            type: "welcome",
            message: "Thanks",
          },
        }));
        break;
      case "welcome":
        console.log(message.event.type);
        break;
    }
  };

  socket.onerror = () => {
    console.log("Connection error!");
  };
  socket.onclose = () => {
    console.log("Connection closed!");
  };
})();
