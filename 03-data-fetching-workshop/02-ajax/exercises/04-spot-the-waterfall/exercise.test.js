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
const STATIC_PORT = 3072;

const testUsers = [
  { id: 1, name: "Priya Sharma", email: "priya@suki.io", role: "Frontend Engineer", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Priya" },
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
    const user = testUsers.find(u => u.id === userId) || testUsers[0];
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

describe("Exercise 04: Spot the Waterfall", () => {
  describe("solution.html static analysis", () => {
    it("should NOT include jQuery (native fetch only)", () => {
      expect(solutionHtml).not.toMatch(/cdnjs\.cloudflare\.com.*jquery/);
      expect(solutionHtml).not.toContain("$.get");
      expect(solutionHtml).not.toContain("$.ajax");
    });

    it("should use fetch() API", () => {
      expect(solutionHtml).toMatch(/fetch\s*\(/);
    });

    it("should use async/await", () => {
      expect(solutionHtml).toMatch(/async\s+function/);
      expect(solutionHtml).toMatch(/await\s+fetch/);
    });

    it("should use Promise.all for parallel requests", () => {
      expect(solutionHtml).toContain("Promise.all");
    });

    it("should check response.ok (the fetch gotcha)", () => {
      expect(solutionHtml).toMatch(/response\.ok|Res\.ok|\.ok\s*\)/);
    });

    it("should fetch from required endpoints", () => {
      // Code uses template literals like ${API_BASE}/users?delay=800
      // So we check for the path portions
      expect(solutionHtml).toMatch(/\/users\?delay/);
      expect(solutionHtml).toMatch(/\/users\/1\?delay/);
      expect(solutionHtml).toMatch(/\/users\/2\/posts\?delay/);
      expect(solutionHtml).toMatch(/\/posts\?delay/);
      expect(solutionHtml).toMatch(/\/comments\?delay/);
    });

    it("should have optimized function that uses Promise.all", () => {
      // Extract the loadDashboardOptimized function
      const optimizedMatch = solutionHtml.match(/async\s+function\s+loadDashboardOptimized[\s\S]*?(?=async\s+function|\<\/script\>)/);
      expect(optimizedMatch).not.toBeNull();
      const optimizedCode = optimizedMatch[0];
      expect(optimizedCode).toContain("Promise.all");
    });
  });

  describe("problem.html static analysis", () => {
    it("should NOT include jQuery (native fetch only)", () => {
      expect(problemHtml).not.toMatch(/cdnjs\.cloudflare\.com.*jquery/);
    });

    it("should have sequential version implemented", () => {
      expect(problemHtml).toContain("loadDashboardSequential");
      // The sequential version should have multiple await fetch statements in sequence
      const sequentialMatch = problemHtml.match(/async\s+function\s+loadDashboardSequential[\s\S]*?(?=async\s+function|\/\/\s*─)/);
      expect(sequentialMatch).not.toBeNull();
    });

    it("should have all helper functions intact", () => {
      expect(problemHtml).toContain("function renderTeamList");
      expect(problemHtml).toContain("function renderProfile");
      expect(problemHtml).toContain("function renderPosts");
      expect(problemHtml).toContain("function renderComments");
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
    it("Sequential: should load all 6 requests and display dashboard", async () => {
      page = await browser.newPage();
      await page.goto(`http://localhost:${STATIC_PORT}/problem.html`);

      // Click the Load Dashboard (Sequential) button
      await page.click("#load-sequential-btn");

      // Wait for team list to appear (first request result)
      await page.waitForSelector("#team-list-sequential .user-item", { timeout: 10000 });

      // Wait for profile to appear
      await page.waitForSelector("#profile-sequential .profile-header", { timeout: 10000 });

      // Wait for posts to appear
      await page.waitForSelector("#posts-sequential .post-item", { timeout: 10000 });

      // Wait for comments to appear
      await page.waitForSelector("#comments-sequential .comment-item", { timeout: 10000 });

      // Wait for teammate posts to appear
      await page.waitForSelector("#teammate-posts-sequential .post-item", { timeout: 10000 });

      // Verify team list loaded (5 users)
      const teamItems = await page.locator("#team-list-sequential .user-item").count();
      expect(teamItems).toBe(5);

      // Verify posts loaded
      const postItems = await page.locator("#posts-sequential .post-item").count();
      expect(postItems).toBeGreaterThanOrEqual(1);

      await page.close();
    });

    it("Sequential: should display total time after loading", async () => {
      page = await browser.newPage();
      await page.goto(`http://localhost:${STATIC_PORT}/problem.html`);

      // Click the Load Dashboard button
      await page.click("#load-sequential-btn");

      // Wait for total time to appear
      await page.waitForSelector("#total-time-sequential:not([class*='hidden'])", { timeout: 10000 });

      // Check that total time is displayed
      const totalTimeText = await page.locator("#time-value-sequential").textContent();
      const timeMs = parseInt(totalTimeText.replace("ms", ""), 10);
      expect(timeMs).toBeGreaterThan(0);

      await page.close();
    });

    it("Sequential: should log all 6 network requests", async () => {
      page = await browser.newPage();
      await page.goto(`http://localhost:${STATIC_PORT}/problem.html`);

      // Click the Load Dashboard button
      await page.click("#load-sequential-btn");

      // Wait for all requests to complete
      await page.waitForSelector("#teammate-posts-sequential .post-item", { timeout: 10000 });

      // Count log entries
      const logEntries = await page.locator("#log-sequential .log-entry").count();
      expect(logEntries).toBe(6);

      await page.close();
    });

    it("Optimized: should load dashboard with Promise.all", async () => {
      page = await browser.newPage();
      await page.goto(`http://localhost:${STATIC_PORT}/problem.html`);

      // Switch to Optimized tab
      await page.click('button:has-text("Optimized")');

      // Click the Load Dashboard (Optimized) button
      await page.click("#load-optimized-btn");

      // Wait for team list to appear
      await page.waitForSelector("#team-list-optimized .user-item", { timeout: 10000 });

      // Wait for profile to appear
      await page.waitForSelector("#profile-optimized .profile-header", { timeout: 10000 });

      // Wait for posts to appear
      await page.waitForSelector("#posts-optimized .post-item", { timeout: 10000 });

      // Wait for comments to appear
      await page.waitForSelector("#comments-optimized .comment-item", { timeout: 10000 });

      // Verify team list loaded (5 users)
      const teamItems = await page.locator("#team-list-optimized .user-item").count();
      expect(teamItems).toBe(5);

      await page.close();
    });

    it("Optimized: should use fewer requests than sequential (eliminate redundancy)", async () => {
      page = await browser.newPage();
      await page.goto(`http://localhost:${STATIC_PORT}/problem.html`);

      // Switch to Optimized tab
      await page.click('button:has-text("Optimized")');

      // Click the Load Dashboard button
      await page.click("#load-optimized-btn");

      // Wait for all data to load
      await page.waitForSelector("#comments-optimized .comment-item", { timeout: 10000 });

      // Count log entries - should be 5 (not 6) because we eliminated the redundant /users call
      const logEntries = await page.locator("#log-optimized .log-entry").count();
      expect(logEntries).toBe(5);

      await page.close();
    });

    it("Optimized: should display comparison box after both loads", async () => {
      page = await browser.newPage();
      await page.goto(`http://localhost:${STATIC_PORT}/problem.html`);

      // First load sequential
      await page.click("#load-sequential-btn");
      await page.waitForSelector("#total-time-sequential:not([class*='hidden'])", { timeout: 10000 });

      // Then switch to optimized and load
      await page.click('button:has-text("Optimized")');
      await page.click("#load-optimized-btn");

      // Wait for comparison box to appear
      await page.waitForSelector("#comparison-box:not([class*='hidden'])", { timeout: 10000 });

      // Check that comparison values are displayed
      const sequentialText = await page.locator("#compare-sequential").textContent();
      const optimizedText = await page.locator("#compare-optimized").textContent();
      const savingsText = await page.locator("#compare-savings").textContent();

      expect(sequentialText).not.toBe("—");
      expect(optimizedText).not.toBe("—");
      expect(savingsText).toContain("%");

      await page.close();
    });
  });
});
