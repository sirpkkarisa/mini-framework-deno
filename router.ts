// deno-lint-ignore-file ban-types
// import { RequestHandler, ResponseHandler } from "./modules.ts";

interface route_type {
  pathname: string;
  method?: string;
  value: string | Function;
}

export class RouteHandler {
  private routes: route_type[] = [];
  constructor(routes: route_type[]) {
    this.routes = routes;
  }
  post(pathname: string, value: string | Function) {
    pathname.trim().length !== 0 ? pathname : pathname + "/";
    this.routes.push({ pathname, method: "post", value });
    return this;
  }
  put(pathname: string, value: string | Function) {
    pathname.trim().length !== 0 ? pathname : pathname + "/";
    this.routes.push({ pathname, method: "put", value });
    return this;
  }
  patch(pathname: string, value: string | Function) {
    pathname.trim().length !== 0 ? pathname : pathname + "/";
    this.routes.push({ pathname, method: "patch", value });
    return this;
  }
  delete(pathname: string, value: string | Function) {
    pathname.trim().length !== 0 ? pathname : pathname + "/";
    this.routes.push({ pathname, method: "delete", value });
    return this;
  }
  get(pathname: string, value: string | Function) {
    pathname.trim().length !== 0 ? pathname : pathname + "/";
    this.routes.push({ pathname, method: "get", value });
    return this;
  }
  socket(pathname: string, value: string | Function) {
    pathname.trim().length !== 0 ? pathname : pathname + "/";
    this.routes.push({ pathname, value });
    return this;
  }
}
