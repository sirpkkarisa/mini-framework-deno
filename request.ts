// deno-lint-ignore-file ban-types
import { ResponseHandler, scanDir } from "./modules.ts";

interface route_type {
  pathname: string;
  method?: string;
  value: Function | string;
}

export class RequestHandler {
  private request: Request;
  private routes: route_type[] = [];
  private response: ResponseHandler;
  private pathname: string;

  constructor(
    request: Request,
    routes: route_type[],
    response: ResponseHandler,
  ) {
    this.request = request;
    this.routes = routes;
    this.response = response;
    this.pathname = (new URL(this.request.url)).pathname;
  }

  handleFilePathRequest() {
    const data = this.routes.find((path) =>
      path.pathname == "/" && path.method == this.request.method.toLowerCase()
    );
    const values = this.pathname.split("/").filter((v) => v.length);

    if (!data || typeof data.value == "function") {
      return this.response.bad_request();
    }
    values[0] = `${data.value.split(":")[0]}/${values[0]}`;
    return scanDir(values[0], values[1]);
  }

  handleWebSocket() {
    const upgrade = this.request.headers.get("upgrade");

    if (upgrade && upgrade.toLowerCase() === "websocket") {
      const resp = Deno.upgradeWebSocket(this.request);
      const data = this.routes.find((path) => path.pathname == this.pathname);

      if (!data || typeof data.value != "function") {
        return this.response.bad_request();
      }
      data.value(resp.socket, this.response);
      return resp.response;
    }
    return this.response.not_found();
  }

  handleStaticRoutes(payload: route_type): Promise<Uint8Array> {
    const values = (payload.value as string).split(":");
    return scanDir(values[0], values[1]);
  }

  getPayload(): route_type | undefined {
    return this.routes.find((path) =>
      path.pathname == this.pathname &&
      path.method == this.request.method.toLowerCase()
    );
  }

  end(): Response | PromiseLike<Response> {
    return (this.getPayload()!.value as Function)(this.request, this.response);
  }
}
