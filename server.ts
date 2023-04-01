// deno-lint-ignore-file
import { RequestHandler, ResponseHandler, RouteHandler } from "./modules.ts";

interface initVals {
  port: number;
  message?: string;
}

interface route_type {
  pathname: string;
  method?: string;
  value: Function | string;
}

// Main class
export class Application {
  private response: ResponseHandler;
  private routes: route_type[];
  private request: RequestHandler | undefined;
  router: RouteHandler;
  constructor() {
    this.response = new ResponseHandler();
    this.routes = [];
    this.router = new RouteHandler(this.routes);
  }
  // Initialize the server
  async serve(values: initVals) {
    const server = Deno.listen({ port: values.port });
    values.message = values.message ??
      "Server is running on port " + values.port;
    console.log(values.message);

    for await (const conn of server) {
      const http = Deno.serveHttp(conn);
      (async () => {
        for await (const reqEvent of http) {
          await reqEvent.respondWith(this.requestHandler(reqEvent.request));
        }
      })();
    }
  }

  private async requestHandler(req: Request): Promise<Response> {
    const { url, method } = req;
    const { pathname } = new URL(url);
    this.request = new RequestHandler(req, this.routes, this.response);

    try {
      if (!this.request.getPayload() && pathname.lastIndexOf(".") !== -1) {
        return this.response.send(
          await this.request.handleFilePathRequest() as Uint8Array,
        ).ok();
      } else {
        const upgrade = req.headers.get("upgrade") || "";
        if (upgrade.toLowerCase() == "websocket") {
          return this.request.handleWebSocket();
        }

        if (
          this.request.getPayload() &&
          typeof this.request.getPayload()!.value == "string" &&
          method.toLowerCase() == "get"
        ) {
          return this.response.send(
            await this.request.handleStaticRoutes(
              this.request.getPayload() as route_type,
            ),
          ).ok();
        }
        if (
          !this.request.getPayload() ||
          typeof this.request.getPayload()!.value != "function"
        ) return this.response.bad_request();

        if (method.toLowerCase() == "get") return this.request.end();
        if (method.toLowerCase() == "post") return this.request.end();
        if (method.toLowerCase() == "put") return this.request.end();
        if (method.toLowerCase() == "patch") return this.request.end();
        if (method.toLowerCase() == "delete") return this.request.end();
      }
      return this.response.not_found();
    } catch (error) {
      if (error.message.toLowerCase().indexOf("no such file") !== -1) {
        return this.response.not_found(error.message);
      }
      return this.response.server_error(error.message);
    }
  }
}
