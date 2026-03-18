# Exercise 03: Promises, Fetch & async/await — Flattening the Pyramid

## Context

In Exercise 02, you experienced callback hell — 3 levels of nested callbacks, scattered
error handling, code drifting to the right. Promises (ES6, 2015) and the Fetch API were
designed to fix this.

In this exercise, you'll rewrite the same user → posts → comments chain **three different
ways** and see what each approach gives you.

## Your Task

This exercise has THREE parts:

### Part A — fetch() + .then() chains

Rewrite the nested callback waterfall using `fetch()` and `.then()` chaining. The pyramid
flattens into a chain. Error handling consolidates into a single `.catch()` at the end.

```js
fetch(url1)
  .then(r => r.json())
  .then(data1 => {
    // use data1...
    return fetch(url2);  // returning a Promise continues the chain
  })
  .then(r => r.json())
  .then(data2 => { ... })
  .catch(err => { /* ONE place handles ALL errors */ });
```

### Part B — async/await

Rewrite the same logic using `async/await`. It reads like synchronous code — top to
bottom, no callbacks, no `.then()`. `try/catch` replaces `.catch()`.

```js
async function fetchData() {
  try {
    const res1 = await fetch(url1);
    const data1 = await res1.json();

    const res2 = await fetch(url2);
    const data2 = await res2.json();
    // ...
  } catch (err) {
    // Handle errors
  }
}
```

### Part C — Promise.all for independent requests

New scenario — fetch ALL 5 users' posts **in parallel**. We don't need user 1's posts
before fetching user 2's posts — these are INDEPENDENT requests.

Use `Promise.all` to fire them simultaneously. Compare the total time:
- Sequential: ~1500ms (5 × 300ms)
- Parallel: ~300ms (all requests run at the same time)

## What to Observe

1. **Part A and B**: Open the Network panel. You'll see 3 sequential requests
   (~900ms total). The SYNTAX is cleaner but the WATERFALL is identical to Exercise 02.
   **Promises don't make things parallel — they make async code easier to write.**

2. **Part C**: Open the Network panel. You'll see 5 requests firing at the SAME TIME
   (~300ms total instead of ~1500ms). This is the power of `Promise.all` for independent data.

3. **The fetch() gotcha**: `fetch()` does NOT reject on 404/500. A 404 resolves the
   Promise successfully. You must check `response.ok` yourself and throw manually.

## Hints

**fetch() basics:**
```js
// fetch returns a Promise
// response.json() also returns a Promise
fetch(url)
  .then(response => {
    if (!response.ok) throw new Error("Request failed: " + response.status);
    return response.json();
  })
  .then(data => console.log(data));
```

**async/await basics:**
```js
const response = await fetch(url);
if (!response.ok) throw new Error("Request failed");
const data = await response.json();
```

**Promise.all basics:**
```js
// Array of Promises
const promises = [fetch(url1), fetch(url2), fetch(url3)];

// Wait for ALL to complete
const results = await Promise.all(promises);
// results is an array of responses in the same order
```

**API response format:** `{ data: ... }` on all endpoints.

## How to Check Your Solution

```bash
# Terminal 1: Start the API server
npm run api

# Terminal 2: Run the tests
npm run exercise 03
```

Or open `problem.html` in your browser and:
1. Click "Load Profile (.then)" — should show user, posts, comments (~900ms)
2. Click "Load Profile (await)" — same data, same time, cleaner code
3. Click "Load All Posts (parallel)" — should show all 5 users' posts (~600ms total)

## Key Takeaway

We've now seen the full evolution of async JavaScript syntax:

**Callbacks → Promises → async/await**

The code got dramatically cleaner, but for **dependent data**, the waterfall remained.
Promises can parallelize INDEPENDENT requests with `Promise.all`, but can't help when
request B needs data from request A.

This waterfall problem becomes the central challenge once we move to React and
component-level fetching in Session 3.

---

**Bridge to Exercise 04:** Now that you understand the primitives (fetch, Promises,
async/await), you're ready to see how these patterns combine with React's component
lifecycle — and why that combination creates new waterfall problems.
