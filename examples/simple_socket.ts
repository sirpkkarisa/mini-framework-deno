import { Application } from "../server.ts";

/**
 * EXAMPLE 2
 */

const app = new Application();
app.serve({ port: 5555 });

app.get("/", "public:index.html");
app.socket("/chat", (socket, res) => {
  socket.onopen = () => {
    socket.send(JSON.stringify({
      event: {
        type: "user-connected",
      },
    }));
    console.log("Socket connected ");
  };
  socket.omessage = (message) => {
    message = JSON.parse(message.data);
    switch (message.event.type) {
      case "test":
        socket.send(res.json({
          event: {
            type: "test",
            message: "welcome",
          },
        }));
        break;
    }
  };

  socket.onerror = () => {
    console.log("Something went wrong!");
  };
  socket.onclose = () => {
    console.log("Connection closed!");
  };
});
