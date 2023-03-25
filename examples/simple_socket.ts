import { Application, ResponseHandler } from "../modules.ts";

/**
 * EXAMPLE 2
 */

const app = new Application();
app.serve({ port: 5555 });

app.router.get("/", "public:index.html");
app.router.socket("/chat", (socket: WebSocket, _res: ResponseHandler) => {
  socket.onopen = () => {
    socket.send(JSON.stringify({
      event: {
        type: "user-connected",
      },
    }));
    console.log("Socket connected ");
  };

  socket.onmessage = (message: MessageEvent<string>) => {
    const msg = JSON.parse(message.data) as Record<
      string,
      Record<string, unknown>
    >;
    switch (msg.event.type) {
      case "user-connected":
        socket.send(JSON.stringify({
          event: {
            type: "welcome",
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
