import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { createServer } from "http";
import express from "express";
import cors from "cors";
import { chromium } from "@playwright/test";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ─────────────────────────────────────────────────────────────────────────────
// Read HTML Files for static analysis
// ─────────────────────────────────────────────────────────────────────────────

const solutionPath = resolve(__dirname, "solution.html");
const problemPath = resolve(__dirname, "problem.html");

const solutionHtml = readFileSync(solutionPath, "utf-8");
const problemHtml = readFileSync(problemPath, "utf-8");

// ─────────────────────────────────────────────────────────────────────────────
// Test Setup: API Server + Static File Server + Browser
// ─────────────────────────────────────────────────────────────────────────────

let apiServer;
let staticServer;
let browser;
let page;

const API_PORT = 3069;
const STATIC_PORT = 3070;

const testUser = {
  id: 1,
  name: "Priya Sharma",
  email: "priya@suki.io",
  role: "Frontend Engineer",
  avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Priya",
};

const testUsers = [
  testUser,
  { id: 2, name: "Rahul Mehta", email: "rahul@suki.io", role: "Backend Engineer", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Rahul" },
  { id: 3, name: "Ananya Reddy", email: "ananya@suki.io", role: "Product Manager", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Ananya" },
];

const testPosts = [
  { id: 1, userId: 1, title: "Getting Started with React", body: "React is great...", createdAt: "2024-01-15" },
  { id: 2, userId: 1, title: "CSS Container Queries", body: "Container queries are here...", createdAt: "2024-02-20" },
];

const testComments = [
  { id: 1, postId: 1, userId: 2, body: "Great introduction!", createdAt: "2024-01-16" },
  { id: 2, postId: 1, userId: 3, body: "How does this affect our codebase?", createdAt: "2024-01-17" },
];

beforeAll(async () => {
  // Start API server
  const apiApp = express();
  apiApp.use(cors());
  apiApp.use(express.json());

  apiApp.get("/api/users", (req, res) => {
    const delay = parseInt(req.query.delay, 10) || 0;
    setTimeout(() => res.json({ data: testUsers, total: testUsers.length }), delay);
  });

  apiApp.get("/api/users/:id", (req, res) => {
    const delay = parseInt(req.query.delay, 10) || 0;
    setTimeout(() => res.json({ data: testUser }), delay);
  });

  apiApp.get("/api/users/:id/posts", (req, res) => {
    const delay = parseInt(req.query.delay, 10) || 0;
    setTimeout(() => res.json({ data: testPosts }), delay);
  });

  apiApp.get("/api/posts/:id/comments", (req, res) => {
    const delay = parseInt(req.query.delay, 10) || 0;
    setTimeout(() => res.json({ data: testComments }), delay);
  });

  apiServer = createServer(apiApp);
  await new Promise((resolve) => apiServer.listen(API_PORT, resolve));

  // Start static file server
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
// Static Analysis Tests
// ─────────────────────────────────────────────────────────────────────────────

describe("Exercise 02: Callback Hell", () => {
  describe("solution.html static analysis", () => {
    it("should include jQuery CDN", () => {
      expect(solutionHtml).toContain("jquery");
      expect(solutionHtml).toMatch(/cdnjs\.cloudflare\.com.*jquery/);
    });

    it("should use jQuery AJAX methods", () => {
      expect(solutionHtml).toMatch(/\$\.get\s*\(/);
    });

    it("should have nested callbacks (3 levels deep)", () => {
      // Check for multiple .fail() handlers (one per nesting level)
      const failMatches = solutionHtml.match(/\.fail\s*\(\s*function/g);
      expect(failMatches).not.toBeNull();
      expect(failMatches.length).toBeGreaterThanOrEqual(3);
    });

    it("should display total waterfall time", () => {
      expect(solutionHtml).toContain("showTotalTime");
      expect(solutionHtml).toContain("totalStart");
    });

    it("should fetch user, posts, and comments endpoints", () => {
      // Check for the three endpoint patterns (via API_BASE + path)
      expect(solutionHtml).toMatch(/["']\/users\/1/);
      expect(solutionHtml).toMatch(/\/posts\?delay/);
      expect(solutionHtml).toMatch(/\/comments\?delay/);
    });
  });

  describe("problem.html static analysis", () => {
    it("should include jQuery CDN", () => {
      expect(problemHtml).toContain("jquery");
      expect(problemHtml).toMatch(/cdnjs\.cloudflare\.com.*jquery/);
    });

    it("should have all helper functions intact", () => {
      expect(problemHtml).toContain("function renderUsers");
      expect(problemHtml).toContain("function renderProfile");
      expect(problemHtml).toContain("function renderPosts");
      expect(problemHtml).toContain("function renderComments");
      expect(problemHtml).toContain("function showLoading");
      expect(problemHtml).toContain("function showProfileLoading");
      expect(problemHtml).toContain("function showTotalTime");
      expect(problemHtml).toContain("function logRequest");
      expect(problemHtml).toContain("function updateLogEntry");
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // Browser Tests (run against problem.html)
  // ─────────────────────────────────────────────────────────────────────────────

  describe("problem.html browser tests", () => {
    it("Part A: should load users when clicking 'Load Team' button", async () => {
      page = await browser.newPage();
      await page.goto(`http://localhost:${STATIC_PORT}/problem.html`);

      // Click the Load Team button
      await page.click("#load-users-btn");

      // Wait for user cards to appear (will fail if fetchUsers not implemented)
      await page.waitForSelector(".user-card", { timeout: 5000 });

      // Verify users loaded
      const userCards = await page.locator(".user-card").count();
      expect(userCards).toBe(3);
    });

    it("Part B: should load user profile with posts and comments", async () => {
      page = await browser.newPage();
      await page.goto(`http://localhost:${STATIC_PORT}/problem.html`);

      // Click the Load User Profile button
      await page.click("#load-profile-btn");

      // Wait for profile card to appear
      await page.waitForSelector(".profile-card", { timeout: 5000 });

      // Wait for posts to appear
      await page.waitForSelector(".post-item", { timeout: 5000 });

      // Wait for comments to appear
      await page.waitForSelector(".comment-item", { timeout: 5000 });

      // Verify all 3 levels loaded
      const profileCard = await page.locator(".profile-card").count();
      expect(profileCard).toBe(1);

      const postItems = await page.locator(".post-item").count();
      expect(postItems).toBe(2);

      const commentItems = await page.locator(".comment-item").count();
      expect(commentItems).toBe(2);
    });

    it("Part B: should display total waterfall time", async () => {
      page = await browser.newPage();
      await page.goto(`http://localhost:${STATIC_PORT}/problem.html`);

      // Click the Load User Profile button
      await page.click("#load-profile-btn");

      // Wait for total time to appear
      await page.waitForSelector("#total-time:not([style*='display: none'])", { timeout: 5000 });

      // Check that total time is displayed and reasonable (should be > 0)
      const totalTimeText = await page.locator("#total-time-value").textContent();
      const timeMs = parseInt(totalTimeText.replace("ms", ""), 10);
      expect(timeMs).toBeGreaterThan(0);
    });

    it("Part B: should show 3 network requests in sequence", async () => {
      page = await browser.newPage();
      await page.goto(`http://localhost:${STATIC_PORT}/problem.html`);

      // Click the Load User Profile button
      await page.click("#load-profile-btn");

      // Wait for all requests to complete
      await page.waitForSelector("#total-time:not([style*='display: none'])", { timeout: 5000 });

      // Check that 3 network entries are logged
      const networkEntries = await page.locator(".network-entry").count();
      expect(networkEntries).toBeGreaterThanOrEqual(3);
    });
  });
});
