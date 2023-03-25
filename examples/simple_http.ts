import { Application, ResponseHandler } from "../modules.ts";

/**
 * EXAMPLE 1
 */

const app = new Application();
app.serve({ port: 5555 });

app.router.get("/", "public:index.html");
app.router.get("/css", "public:style.css");
app.router.get(
  "/home",
  (_req: Request, res: ResponseHandler) => res.send("home").ok(),
);
app.router.get(
  "/hello",
  (_req: Request, res: ResponseHandler) => res.send("hello").ok(),
);
app.router.post(
  "/",
  (_req: Request, res: ResponseHandler) => res.json({ message: "post" }).ok(),
);
app.router.put(
  "/",
  (_req: Request, res: ResponseHandler) => res.json({ message: "put" }).ok(),
);
app.router.patch(
  "/",
  (_req: Request, res: ResponseHandler) => res.json({ message: "patch" }).ok(),
);
app.router.delete(
  "/",
  (_req: Request, res: ResponseHandler) => res.json({ message: "delete" }).ok(),
);
