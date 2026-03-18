import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["**/exercises/**/*.test.js"],
    testTimeout: 15000,
    hookTimeout: 30000,
  },
});
