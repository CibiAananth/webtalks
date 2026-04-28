import { describe, it, expect } from "vitest";
import { existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

describe("Session 03: React exercise structure", () => {
  it("Exercise 05 should have all step files", () => {
    const base = resolve(__dirname, "05-useeffect-fetch/steps");
    expect(existsSync(resolve(base, "Step1.tsx"))).toBe(true);
    expect(existsSync(resolve(base, "Step2.tsx"))).toBe(true);
    expect(existsSync(resolve(base, "Step3.tsx"))).toBe(true);
    expect(existsSync(resolve(base, "Step4Complete.tsx"))).toBe(true);
  });

  it("Exercise 06 should have all bug scenario files", () => {
    const base = resolve(__dirname, "06-spot-the-bugs/bugs");
    expect(existsSync(resolve(base, "RaceConditionBug.tsx"))).toBe(true);
    expect(existsSync(resolve(base, "MemoryLeakBug.tsx"))).toBe(true);
    expect(existsSync(resolve(base, "DuplicateRequestsBug.tsx"))).toBe(true);
    expect(existsSync(resolve(base, "StaleCacheBug.tsx"))).toBe(true);
  });

  it("Exercise 07 should have page file", () => {
    expect(existsSync(resolve(__dirname, "07-component-waterfall/page.tsx"))).toBe(true);
  });

  it("Exercise 08 should have page file", () => {
    expect(existsSync(resolve(__dirname, "08-lifting-fetch-up/page.tsx"))).toBe(true);
  });
});
