import { describe, it, expect } from "vitest";
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

describe("Session 04: React Query & Suspense Exercises", () => {
  const exercises = [
    { id: "09-query-waterfall", name: "Query Waterfall" },
    { id: "10-suspense", name: "Suspense" },
  ];

  exercises.forEach(({ id, name }) => {
    describe(`Exercise ${id}: ${name}`, () => {
      const exerciseDir = join(__dirname, id);

      it("has page.tsx file", () => {
        expect(existsSync(join(exerciseDir, "page.tsx"))).toBe(true);
      });
    });
  });
});
