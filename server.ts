interface initVals {
  port?: number;
  message?: string;
}

class ResponseHandler {
  json(data: Record<string, unknown>) {
    this.data = JSON.stringify(data);
    return this;
  }

  send(data: unknown) {
    this.data = data;
    return this;
  }

  status(value: number) {
    this.status = value;
    return this;
  }
}

// This function does not always work!!
async function scanDir(path: string, filename: string) {
  const concatDirAndFile = path + "/" + filename;
  try {
    const dir = await Deno.lstat(concatDirAndFile);
    if (dir.isFile) {
      return Deno.readFile(concatDirAndFile);
    }
  } catch (_error) {
    for await (const entry of Deno.readDir(path)) {
      if (entry.isDirectory) {
        return scanDir(path + "/" + entry.name, filename);
      }
    }

    return "Not Found: " + filename;
  }
}

export class Application {
  constructor() {
    this.responseHandler = new ResponseHandler();
    this.routes = [];
  }

  async serve(values: initVals) {
    const server = await Deno.listen({ port: values.port });
    values.message = values.message ??
      "Server is running on port " + values.port;
    console.log(values.message);

    for await (const conn of server) {
      const http = await Deno.serveHttp(conn);
      (async () => {
        for await (const reqEvent of http) {
          await reqEvent.respondWith(this.requestHandler(reqEvent.request));
        }
      })();
    }
  }

  private async requestHandler(req: Request) {
    const { url, method } = req;
    const { pathname } = new URL(url);
    let response = {};

    try {
      let payload = this.routes.find((path) =>
        path.pathname == pathname && path.method == method.toLowerCase()
      );
      if (!payload && pathname.lastIndexOf(".") !== -1) {
        const values = pathname.split("/").filter((v) => v.length);
        payload = this.routes.find((path) =>
          path.pathname == "/" && path.method == method.toLowerCase()
        );
        values[0] = `${payload.value.split(":")[0]}/${values[0]}`;
        response.data = await scanDir(values[0], values[1]);
      } else {
        const upgrade = req.headers.get("upgrade");

        if (upgrade && upgrade.toLowerCase() === "websocket") {
          const resp = await Deno.upgradeWebSocket(req);
          payload = this.routes.find((path) => path.pathname == pathname);
          payload.value(resp.socket, this.responseHandler);
          return resp.response;
        }

        if (payload && payload.value && method.toLowerCase() == "get") {
          if (typeof payload.value != "function") {
            const values = payload.value.split(":");
            response.data = await scanDir(values[0], values[1]);
          } else {
            response = payload.value(req, this.responseHandler);
          }
        } else if (payload && payload.value && method.toLowerCase() == "post") {
          response = payload.value(req, this.responseHandler);
        } else if (payload && payload.value && method.toLowerCase() == "put") {
          response = payload.value(req, this.responseHandler);
        } else if (
          payload && payload.value && method.toLowerCase() == "patch"
        ) {
          response = payload.value(req, this.responseHandler);
        } else if (
          payload && payload.value && method.toLowerCase() == "delete"
        ) {
          response = payload.value(req, this.responseHandler);
        } else {
          response = {
            data: "Page Not Found",
            options: {
              status: 404,
              statusText: "Not Found",
            },
          };
        }
      }

      return new Response(response.data, response.options);
    } catch (error) {
      return new Response(error.message);
    }
  }

  get(pathname: string, value) {
    this.userDefinedPath = pathname.trim().length !== 0
      ? pathname
      : pathname + "/";
    this.routes.push({ pathname: this.userDefinedPath, method: "get", value });
    return this;
  }

  post(pathname: string, value) {
    this.userDefinedPath = pathname.trim().length !== 0
      ? pathname
      : pathname + "/";
    this.routes.push({ pathname: this.userDefinedPath, method: "post", value });
    return this;
  }

  put(pathname: string, value) {
    this.userDefinedPath = pathname.trim().length !== 0
      ? pathname
      : pathname + "/";
    this.routes.push({ pathname: this.userDefinedPath, method: "put", value });
    return this;
  }

  patch(pathname: string, value) {
    this.userDefinedPath = pathname.trim().length !== 0
      ? pathname
      : pathname + "/";
    this.routes.push({
      pathname: this.userDefinedPath,
      method: "patch",
      value,
    });
    return this;
  }

  delete(pathname: string, value) {
    this.userDefinedPath = pathname.trim().length !== 0
      ? pathname
      : pathname + "/";
    this.routes.push({
      pathname: this.userDefinedPath,
      method: "delete",
      value,
    });
    return this;
  }

  socket(pathname: string, value) {
    this.userDefinedPath = pathname.trim().length !== 0
      ? pathname
      : pathname + "/";
    this.routes.push({
      pathname: this.userDefinedPath,
      method: "socket",
      value,
    });
    return this;
  }
}
