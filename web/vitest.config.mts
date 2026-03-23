import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: "node",
    setupFiles: ["./__tests__/setup.ts"],
    pool: "forks",
    maxConcurrency: 2,
  },
});
