import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    environmentMatchGlobs: [["tests/components/**", "happy-dom"]],
    setupFiles: ["./tests/setup.ts"],
    env: {
      DB_PATH: ":memory:",
      BETTER_AUTH_SECRET: "test-secret-32-characters-minimum!!",
      BETTER_AUTH_URL: "http://localhost:3000",
    },
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, ".") },
  },
});
