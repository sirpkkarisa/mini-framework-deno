type responseType = BodyInit | undefined;

export class ResponseHandler {
  private data: responseType = undefined;

  json(data: Record<string, unknown>) {
    this.data = JSON.stringify(data);
    return this;
  }

  send(data: responseType) {
    this.data = data;
    return this;
  }

  status(value: number) {
    return value;
  }

  ok(message?: string) {
    if (this.data == undefined) {
      return new Response(message ?? "Operation accepted", {
        status: 200,
        statusText: "OK",
      });
    }

    return new Response(this.data, {
      status: 200,
      statusText: message ?? "OK",
    });
  }

  created(message?: string) {
    if (this.data == undefined) {
      return new Response(message ?? "Operation accepted", {
        status: 201,
        statusText: "Created",
      });
    }

    return new Response(this.data, {
      status: 201,
      statusText: message ?? "Created",
    });
  }

  not_found(message?: string) {
    if (this.data == undefined) {
      return new Response(message ?? "Operation accepted", {
        status: 404,
        statusText: "Not Found",
      });
    }

    return new Response(this.data, {
      status: 404,
      statusText: message ?? "Not Found",
    });
  }

  forbidden(message?: string) {
    if (this.data == undefined) {
      return new Response(message ?? "Cannot proceed with this operation", {
        status: 403,
        statusText: "Forbidden",
      });
    }

    return new Response(this.data, {
      status: 403,
      statusText: message ?? "Forbidden",
    });
  }

  unauthorized(message?: string) {
    if (this.data == undefined) {
      return new Response(
        message ?? "You are unauthorized to perform this operation",
        {
          status: 401,
          statusText: "Unauthorized",
        },
      );
    }

    return new Response(this.data, {
      status: 401,
      statusText: message ?? "Unauthorized",
    });
  }

  bad_request(message?: string) {
    if (this.data == undefined) {
      return new Response(message ?? "Illegal operation", {
        status: 400,
        statusText: "Bad Request",
      });
    }

    return new Response(this.data, {
      status: 400,
      statusText: message ?? "Bad Request",
    });
  }

  too_many_requests(message?: string) {
    if (this.data == undefined) {
      return new Response(message ?? "Too many requests are disallowe", {
        status: 429,
        statusText: "Too many requests",
      });
    }

    return new Response(this.data, {
      status: 429,
      statusText: message ?? "Too many requests",
    });
  }

  server_error(message?: string) {
    return new Response(
      message ?? "There seems to be a problem with the systems.",
      {
        status: 501,
        statusText: "Internal Server Error",
      },
    );
  }

  unimplemented(message?: string) {
    return new Response(message ?? "Something went wrong with our systems.", {
      status: 500,
      statusText: "Unimplemented",
    });
  }
}
