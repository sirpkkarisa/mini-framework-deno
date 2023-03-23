(() => {
  const socket = new WebSocket(`ws://${location.host}/chat`);

  socket.onopen = () => {
    socket.send(JSON.stringify({
      event: {
        type: "user-connected",
      },
    }));
    console.log("Connection established! ", Date.now());
  };

  socket.omessage = (message) => {
    message = JSON.parse(message);
    switch (message.event.type) {
      case "test":
        socket.send(JSON.stringify({
          event: {
            type: "test",
            message: "welcome",
          },
        }));
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
