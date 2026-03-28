import { defineConfig } from "vitest/config";
import { loadEnv } from "vite";

export default defineConfig({
  test: {
    include: ["tests/integration.test.ts"],
    env: loadEnv("", process.cwd(), ""),
  },
});
