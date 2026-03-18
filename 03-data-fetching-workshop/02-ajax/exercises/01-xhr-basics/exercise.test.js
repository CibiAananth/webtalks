import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { createServer } from "http";
import express from "express";
import cors from "cors";
import { chromium } from "@playwright/test";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ─────────────────────────────────────────────────────────────────────────────
// Test Setup: API Server + Static File Server + Browser
// ─────────────────────────────────────────────────────────────────────────────

let apiServer;
let staticServer;
let browser;
let page;

const API_PORT = 3069;
const STATIC_PORT = 3070;

const testUsers = [
  {
    id: 1,
    name: "Priya Sharma",
    email: "priya@suki.io",
    role: "Frontend Engineer",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Priya",
  },
  {
    id: 2,
    name: "Rahul Mehta",
    email: "rahul@suki.io",
    role: "Backend Engineer",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Rahul",
  },
  {
    id: 3,
    name: "Ananya Reddy",
    email: "ananya@suki.io",
    role: "Product Manager",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Ananya",
  },
];

beforeAll(async () => {
  // Start API server
  const apiApp = express();
  apiApp.use(cors());
  apiApp.use(express.json());

  apiApp.get("/api/users", (req, res) => {
    const delay = parseInt(req.query.delay, 10) || 0;
    setTimeout(() => {
      res.json({ data: testUsers, total: testUsers.length });
    }, delay);
  });

  apiServer = createServer(apiApp);
  await new Promise((resolve) => apiServer.listen(API_PORT, resolve));

  // Start static file server for HTML files
  const staticApp = express();
  staticApp.use(express.static(__dirname));
  staticServer = createServer(staticApp);
  await new Promise((resolve) => staticServer.listen(STATIC_PORT, resolve));

  // Launch browser
  browser = await chromium.launch();
});

afterAll(async () => {
  if (page) await page.close();
  if (browser) await browser.close();
  if (apiServer) await new Promise((resolve) => apiServer.close(resolve));
  if (staticServer) await new Promise((resolve) => staticServer.close(resolve));
});

// ─────────────────────────────────────────────────────────────────────────────
// Tests - Run against problem.html (participant's file)
// ─────────────────────────────────────────────────────────────────────────────

describe("Exercise 01: XMLHttpRequest Basics", () => {
  it("should load users when clicking 'Load Team' button", async () => {
    // Open problem.html (the file participant edits)
    page = await browser.newPage();
    await page.goto(`http://localhost:${STATIC_PORT}/problem.html`);

    // Click the Load Team button
    await page.click("#load-btn");

    // Wait for user cards to appear (max 5 seconds)
    // This will timeout and fail if fetchUsers() isn't implemented
    await page.waitForSelector(".user-card", { timeout: 5000 });

    // Verify correct number of users loaded
    const userCards = await page.locator(".user-card").count();
    expect(userCards).toBe(3);
  });

  it("should display user names correctly", async () => {
    // User cards should already be loaded from previous test
    // But let's be safe and reload
    page = await browser.newPage();
    await page.goto(`http://localhost:${STATIC_PORT}/problem.html`);
    await page.click("#load-btn");
    await page.waitForSelector(".user-card", { timeout: 5000 });

    // Check that user names are displayed
    const names = await page.locator(".user-details h3").allTextContents();
    expect(names).toContain("Priya Sharma");
    expect(names).toContain("Rahul Mehta");
    expect(names).toContain("Ananya Reddy");
  });

  it("should show loading state while fetching", async () => {
    page = await browser.newPage();
    await page.goto(`http://localhost:${STATIC_PORT}/problem.html`);

    // Click button and immediately check for loading state
    await page.click("#load-btn");

    // Should show skeleton loaders
    const skeletons = await page.locator(".skeleton").count();
    expect(skeletons).toBeGreaterThan(0);

    // Button should be disabled during loading
    const isDisabled = await page.locator("#load-btn").isDisabled();
    expect(isDisabled).toBe(true);

    // Wait for completion
    await page.waitForSelector(".user-card", { timeout: 5000 });
  });

  it("should update the network activity panel", async () => {
    page = await browser.newPage();
    await page.goto(`http://localhost:${STATIC_PORT}/problem.html`);

    // Initially should show placeholder
    const placeholder = await page.locator(".network-placeholder").count();
    expect(placeholder).toBe(1);

    // Click and wait for request
    await page.click("#load-btn");
    await page.waitForSelector(".user-card", { timeout: 5000 });

    // Should now have a network entry
    const networkEntry = await page.locator(".network-entry").count();
    expect(networkEntry).toBeGreaterThan(0);

    // Should show success status (200)
    const statusText = await page.locator(".network-status").first().textContent();
    expect(statusText).toBe("200");
  });
});
