import { once } from "node:events";
import { createServer, type Server } from "node:http";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import handler from "../api/index.js";

describe("Vercel serverless entrypoint", () => {
  let server: Server;
  let baseUrl: string;

  beforeAll(async () => {
    server = createServer((request, response) => {
      void handler(request, response);
    });

    server.listen(0, "127.0.0.1");
    await once(server, "listening");

    const address = server.address();

    if (!address || typeof address === "string") {
      throw new Error("Failed to resolve test server address");
    }

    baseUrl = `http://127.0.0.1:${address.port}`;
  });

  afterAll(async () => {
    server.close();
    await once(server, "close");
  });

  it("responds to /health", async () => {
    const response = await fetch(`${baseUrl}/health`);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
  });
});
