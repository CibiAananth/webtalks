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
const STATIC_PORT = 3071;

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
  { id: 4, name: "Vikram Patel", email: "vikram@suki.io", role: "DevOps Engineer", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Vikram" },
  { id: 5, name: "Meera Iyer", email: "meera@suki.io", role: "UX Designer", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Meera" },
];

const testPosts = [
  { id: 1, userId: 1, title: "Getting Started with React", body: "React is great...", createdAt: "2024-01-15" },
  { id: 2, userId: 1, title: "CSS Container Queries", body: "Container queries are here...", createdAt: "2024-02-20" },
  { id: 3, userId: 2, title: "Building REST APIs", body: "Express is great...", createdAt: "2024-01-22" },
  { id: 4, userId: 3, title: "Product Roadmap", body: "Good roadmaps...", createdAt: "2024-03-01" },
  { id: 5, userId: 4, title: "Docker Compose", body: "Dev environments...", createdAt: "2024-02-10" },
  { id: 6, userId: 5, title: "Design Systems", body: "Building systems...", createdAt: "2024-03-05" },
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
    const userId = parseInt(req.params.id, 10);
    const user = testUsers.find(u => u.id === userId) || testUser;
    setTimeout(() => res.json({ data: user }), delay);
  });

  apiApp.get("/api/users/:id/posts", (req, res) => {
    const delay = parseInt(req.query.delay, 10) || 0;
    const userId = parseInt(req.params.id, 10);
    const userPosts = testPosts.filter(p => p.userId === userId);
    setTimeout(() => res.json({ data: userPosts }), delay);
  });

  apiApp.get("/api/posts/:id/comments", (req, res) => {
    const delay = parseInt(req.query.delay, 10) || 0;
    const postId = parseInt(req.params.id, 10);
    const postComments = testComments.filter(c => c.postId === postId);
    setTimeout(() => res.json({ data: postComments }), delay);
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

describe("Exercise 03: Promises, Fetch & async/await", () => {
  describe("solution.html static analysis", () => {
    it("should NOT include jQuery (native fetch only)", () => {
      expect(solutionHtml).not.toMatch(/cdnjs\.cloudflare\.com.*jquery/);
      expect(solutionHtml).not.toContain("$.get");
      expect(solutionHtml).not.toContain("$.ajax");
    });

    it("should use fetch() API", () => {
      expect(solutionHtml).toMatch(/fetch\s*\(/);
    });

    it("should use .then() chains in Part A", () => {
      expect(solutionHtml).toMatch(/\.then\s*\(\s*function/);
      expect(solutionHtml).toMatch(/\.catch\s*\(\s*function/);
    });

    it("should use async/await in Part B", () => {
      expect(solutionHtml).toMatch(/async\s+function/);
      expect(solutionHtml).toMatch(/await\s+fetch/);
    });

    it("should use Promise.all in Part C", () => {
      expect(solutionHtml).toContain("Promise.all");
    });

    it("should check response.ok (the fetch gotcha)", () => {
      // Check for response.ok or .ok check
      expect(solutionHtml).toMatch(/response\.ok|\.ok\s*\)/);
    });

    it("should fetch user, posts, and comments endpoints", () => {
      expect(solutionHtml).toMatch(/["']\/users\/1/);
      expect(solutionHtml).toMatch(/\/posts\?delay/);
      expect(solutionHtml).toMatch(/\/comments\?delay/);
    });
  });

  describe("problem.html static analysis", () => {
    it("should NOT include jQuery (native fetch only)", () => {
      expect(problemHtml).not.toMatch(/cdnjs\.cloudflare\.com.*jquery/);
    });

    it("should have all helper functions intact", () => {
      expect(problemHtml).toContain("function renderProfile");
      expect(problemHtml).toContain("function renderPosts");
      expect(problemHtml).toContain("function renderComments");
      expect(problemHtml).toContain("function renderAllUserPosts");
      expect(problemHtml).toContain("function showLoading");
      expect(problemHtml).toContain("function showTotalTime");
      expect(problemHtml).toContain("function switchTab");
      expect(problemHtml).toContain("function logRequest");
      expect(problemHtml).toContain("function updateLogEntry");
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // Browser Tests (run against problem.html)
  // ─────────────────────────────────────────────────────────────────────────────

  describe("problem.html browser tests", () => {
    it("Part A: should load profile using .then() chains", async () => {
      page = await browser.newPage();
      await page.goto(`http://localhost:${STATIC_PORT}/problem.html`);

      // Click the Load Profile button for Part A
      await page.click("#load-then-btn");

      // Wait for profile to appear (will timeout if not implemented)
      await page.waitForSelector(".profile-card", { timeout: 5000 });

      // Wait for posts to appear
      await page.waitForSelector(".post-item", { timeout: 5000 });

      // Wait for comments to appear
      await page.waitForSelector(".comment-item", { timeout: 5000 });

      // Verify profile loaded
      const profileCard = await page.locator(".profile-card").count();
      expect(profileCard).toBe(1);

      // Verify posts loaded
      const postItems = await page.locator(".post-item").count();
      expect(postItems).toBeGreaterThanOrEqual(1);

      await page.close();
    });

    it("Part B: should load profile using async/await", async () => {
      page = await browser.newPage();
      await page.goto(`http://localhost:${STATIC_PORT}/problem.html`);

      // Switch to Part B tab
      await page.click('button:has-text("Part B")');

      // Click the Load Profile button for Part B
      await page.click("#load-await-btn");

      // Wait for profile to appear
      await page.waitForSelector("#panel-await .profile-card", { timeout: 5000 });

      // Wait for posts to appear
      await page.waitForSelector("#panel-await .post-item", { timeout: 5000 });

      // Verify profile loaded
      const profileCard = await page.locator("#panel-await .profile-card").count();
      expect(profileCard).toBe(1);

      await page.close();
    });

    it("Part C: should load all users' posts in parallel with Promise.all", async () => {
      page = await browser.newPage();
      await page.goto(`http://localhost:${STATIC_PORT}/problem.html`);

      // Switch to Part C tab
      await page.click('button:has-text("Part C")');

      // Click the Load All Posts button
      await page.click("#load-parallel-btn");

      // Wait for user post cards to appear (5 users)
      await page.waitForSelector(".user-posts-card", { timeout: 5000 });

      // Verify all 5 users' posts loaded
      const userPostCards = await page.locator(".user-posts-card").count();
      expect(userPostCards).toBe(5);

      await page.close();
    });

    it("Part A: should display total waterfall time", async () => {
      page = await browser.newPage();
      await page.goto(`http://localhost:${STATIC_PORT}/problem.html`);

      // Click the Load Profile button
      await page.click("#load-then-btn");

      // Wait for total time to appear
      await page.waitForSelector("#total-time-then:not([style*='display: none'])", { timeout: 5000 });

      // Check that total time is displayed
      const totalTimeText = await page.locator("#total-time-value-then").textContent();
      const timeMs = parseInt(totalTimeText.replace("ms", ""), 10);
      expect(timeMs).toBeGreaterThan(0);

      await page.close();
    });

    it("Part C: should show comparison box after parallel load", async () => {
      page = await browser.newPage();
      await page.goto(`http://localhost:${STATIC_PORT}/problem.html`);

      // Switch to Part C tab
      await page.click('button:has-text("Part C")');

      // Click the Load All Posts button
      await page.click("#load-parallel-btn");

      // Wait for comparison box to appear
      await page.waitForSelector("#comparison-box:not([style*='display: none'])", { timeout: 5000 });

      // Check that parallel time is displayed
      const parallelTimeText = await page.locator("#parallel-actual").textContent();
      expect(parallelTimeText).not.toBe("—");

      await page.close();
    });
  });
});
