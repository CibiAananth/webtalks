# Exercise 04: Spot the Waterfall — Diagnosis & Optimization

## Context

You've learned the mechanics of Promises, async/await, and Promise.all. Now it's time to
apply that knowledge to a real-world scenario: **diagnosing and optimizing** an inefficient
data fetching pattern.

This is the skill that separates junior from senior developers. Anyone can write sequential
code. Seeing the waterfall, understanding dependencies, and restructuring for parallelism —
that's the optimization instinct.

## The Scenario

You're handed a "Team Dashboard" that loads 6 pieces of data:
1. All team members (for the sidebar)
2. Current user profile (for the header)
3. Current user's posts (for the main content)
4. Comments on the first post (for the detail view)
5. Team members again (for a different component — oops!)
6. Another user's posts (for "teammate spotlight")

The original developer wrote this sequentially — each request waits for the previous one.
**Total load time: ~4800ms** (6 requests × 800ms each)

Your job: figure out what ACTUALLY depends on what, and restructure for maximum parallelism.

## Your Task

### Step 1: Analyze the Waterfall

Look at the existing code in `problem.html`. Open the Network panel (DevTools → Network).
Click "Load Dashboard" and watch the waterfall. Each request starts only after the previous
one completes.

**Questions to answer:**
- Which requests are truly DEPENDENT? (need data from a previous request)
- Which requests are INDEPENDENT? (could run in parallel)
- Which requests are REDUNDANT? (fetch the same data twice)

### Step 2: Draw the Dependency Graph

```
Request 1 (users)      Request 2 (user/1)    Request 6 (user/2/posts)
     ↓                      ↓                       ↓
[can skip 5!]          Request 3 (posts)      [independent]
                            ↓
                       Request 4 (comments)
```

### Step 3: Refactor for Parallelism

Restructure the code to:
1. **Eliminate redundancy**: Don't fetch `/api/users` twice
2. **Parallelize independent requests**: 1, 2, and 6 can run simultaneously
3. **Maintain dependencies**: 3 still waits for 2, 4 still waits for 3

**Target load time: ~2400ms** (3 sequential levels instead of 6)

## What to Observe

1. **Before optimization**: Network panel shows 6 sequential bars (waterfall)
2. **After optimization**: Network panel shows parallel bars + shorter chain
3. **Time comparison**: The dashboard displays before/after timing

## The Dependency Graph (Answer Key)

```
Level 1 (parallel):
├── GET /api/users         (800ms) — all team members
├── GET /api/users/1       (800ms) — current user
└── GET /api/users/2/posts (800ms) — teammate's posts

Level 2 (after user/1 completes):
└── GET /api/users/1/posts (800ms) — current user's posts

Level 3 (after posts complete):
└── GET /api/posts/1/comments (800ms) — comments on first post

ELIMINATED:
✗ GET /api/users (redundant — reuse Level 1 data)

Sequential time: 6 × 800ms = 4800ms
Optimized time:  3 × 800ms = 2400ms (50% faster!)
```

## Hints

**Identifying dependencies:**
```js
// This is DEPENDENT — needs userId from previous request
const posts = await fetch(`/api/users/${user.id}/posts`);

// This is INDEPENDENT — hardcoded URL, no previous data needed
const posts = await fetch('/api/users/2/posts');
```

**Promise.all for independent requests:**
```js
const [users, currentUser, teammatePosts] = await Promise.all([
  fetch('/api/users').then(r => r.json()),
  fetch('/api/users/1').then(r => r.json()),
  fetch('/api/users/2/posts').then(r => r.json()),
]);
```

**Caching/reusing data:**
```js
// BAD: Fetch users twice
const users1 = await fetch('/api/users');
// ... later ...
const users2 = await fetch('/api/users'); // Redundant!

// GOOD: Fetch once, reuse
const users = await fetch('/api/users').then(r => r.json());
renderSidebar(users.data);
renderFooter(users.data);  // Reuse same data
```

## How to Check Your Solution

```bash
# Terminal 1: Start the API server
npm run api

# Terminal 2: Run the tests
npm run exercise 04
```

Or open `problem.html` in your browser and:
1. Click "Load Dashboard (Sequential)" — observe ~4800ms, 6 waterfall requests
2. Implement the optimized version
3. Click "Load Dashboard (Optimized)" — should be ~2400ms, parallel requests

## Key Takeaway

**The waterfall problem isn't about syntax — it's about understanding data dependencies.**

Sequential code is easy to write but often hides unnecessary dependencies. The optimization
process is:
1. **Identify** what data each request needs
2. **Classify** as dependent, independent, or redundant
3. **Restructure** using Promise.all for independent requests

This skill becomes critical in React, where component-level fetching can create hidden
waterfalls that are much harder to spot.

---

**Bridge to Session 03:** Now that you've mastered Promise-based fetching in vanilla JS,
you're ready to see how these same patterns apply (and often go wrong) in React components.
