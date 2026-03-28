import Fastify from "fastify";

export function buildApp() {
  const app = Fastify();

  app.get("/health", async () => ({ ok: true }));

  app.post("/reports", async () => {
    throw new Error("POST /reports is not implemented yet");
  });

  app.get("/rankings", async () => {
    throw new Error("GET /rankings is not implemented yet");
  });

  app.get("/apis/:apiId", async () => {
    throw new Error("GET /apis/:apiId is not implemented yet");
  });

  return app;
}
