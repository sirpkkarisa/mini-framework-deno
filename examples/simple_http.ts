import { Application } from "../server.ts";

/**
 * EXAMPLE 1
 */

const app = new Application();
app.serve({ port: 5555 });

app.get("/", "public:index.html");
app.get("/js", "public:main.js");
app.get("/home", (_req, res) => res.json("home"));
app.get("/hello", (_req, res) => res.json("hello"));
app.post("/", (_req, res) => res.json({ message: "post" }));
app.put("/", (_req, res) => res.json({ message: "put" }));
app.patch("/", (_req, res) => res.json({ message: "patch" }));
app.delete("/", (_req, res) => res.json({ message: "delete" }));
