# Exercise 03: Promises & Fetch — Speaker Notes

## Learning Objectives
- Understand how Promises flatten the callback pyramid
- Master fetch() + .then() chaining
- Write clean async/await code
- Use Promise.all for parallel independent requests
- Recognize that Promises don't make things parallel by default

## Setup
Continuing from previous exercises — same API server.

## Talk Track

### Introduction (~2 min)
"In Exercise 02, we had the pyramid of doom — nested callbacks, scattered error handling, code drifting right. Promises (ES6, 2015) and fetch() were designed to fix this."

"We're going to rewrite the same user → posts → comments chain THREE different ways."

### Part A: fetch() + .then() Chains (~10 min)
"First, let's see how Promises flatten the pyramid."

Live code together:
```javascript
fetch("/api/users/1?delay=300")
  .then(response => response.json())
  .then(userData => {
    renderUser(userData.data);
    return fetch("/api/users/" + userData.data.id + "/posts?delay=300");
  })
  .then(response => response.json())
  .then(postsData => {
    renderPosts(postsData.data);
    const firstPost = postsData.data[0];
    return fetch("/api/posts/" + firstPost.id + "/comments?delay=300");
  })
  .then(response => response.json())
  .then(commentsData => {
    renderComments(commentsData.data);
  })
  .catch(error => {
    showError(error.message);
  });
```

**Key points:**
1. "No more nesting! Each `.then()` returns to the same level."
2. "Returning a Promise continues the chain."
3. "ONE `.catch()` at the end handles ALL errors."
4. "The code reads top to bottom, not right to diagonal."

**The fetch() gotcha:**
"Important: `fetch()` does NOT reject on 404 or 500. A 404 resolves successfully. You must check `response.ok` yourself."

```javascript
.then(response => {
  if (!response.ok) throw new Error("HTTP " + response.status);
  return response.json();
})
```

### Part B: async/await (~8 min)
"async/await (ES2017) makes this even cleaner. It looks like synchronous code."

```javascript
async function fetchProfile() {
  try {
    const userRes = await fetch("/api/users/1?delay=300");
    const userData = await userRes.json();
    renderUser(userData.data);

    const postsRes = await fetch("/api/users/" + userData.data.id + "/posts?delay=300");
    const postsData = await postsRes.json();
    renderPosts(postsData.data);

    const firstPost = postsData.data[0];
    const commentsRes = await fetch("/api/posts/" + firstPost.id + "/comments?delay=300");
    const commentsData = await commentsRes.json();
    renderComments(commentsData.data);
  } catch (error) {
    showError(error.message);
  }
}
```

**Ask:** "This looks like regular synchronous code, right? But open the Network tab..."

**Important insight:** "The waterfall is STILL THERE. Same 900ms total. async/await made the CODE cleaner, not the EXECUTION faster."

### Part C: Promise.all (~10 min)
"New scenario. Fetch posts for ALL 5 users. These are INDEPENDENT requests — user 2's posts don't depend on user 1's posts."

**First, the naive approach:**
```javascript
// DON'T DO THIS - sequential when it could be parallel
const posts1 = await fetch("/api/users/1/posts").then(r => r.json());
const posts2 = await fetch("/api/users/2/posts").then(r => r.json());
const posts3 = await fetch("/api/users/3/posts").then(r => r.json());
// ... 5 × 300ms = 1500ms
```

**Then, the optimized approach:**
```javascript
const [posts1, posts2, posts3, posts4, posts5] = await Promise.all([
  fetch("/api/users/1/posts").then(r => r.json()),
  fetch("/api/users/2/posts").then(r => r.json()),
  fetch("/api/users/3/posts").then(r => r.json()),
  fetch("/api/users/4/posts").then(r => r.json()),
  fetch("/api/users/5/posts").then(r => r.json()),
]);
// All run in parallel! ~300ms total
```

"Open the Network tab. Watch all 5 requests fire at the same time. Total time: ~300ms instead of ~1500ms."

### The Key Insight (~3 min)
**Write on whiteboard:**
```
Callbacks → Promises → async/await
         ↓
    SYNTAX improved
         ↓
    WATERFALL unchanged (for dependent data)
```

"Promises and async/await dramatically improved how we WRITE async code. But they don't magically parallelize things."

"Promise.all can parallelize INDEPENDENT requests. But when request B needs data from request A? That waterfall is inherent to the logic."

### Bridge to React (~2 min)
"In React, components often fetch their own data. A UserProfile component fetches user data. A PostList component fetches posts. What happens when PostList is a child of UserProfile?"

"The child can't even START fetching until the parent finishes rendering. This creates a waterfall that's hidden in the component tree — much harder to spot than sequential `await` statements."

"That's what Session 03 is all about."

## Common Questions

**Q: When should I use .then() vs async/await?**
A: async/await is usually cleaner for sequential operations. .then() can be useful for transformations or when you don't need the result immediately.

**Q: What if one Promise.all request fails?**
A: The whole Promise.all rejects. Use Promise.allSettled if you want to continue even when some fail.

**Q: Can I combine await with Promise.all?**
A: Yes! `const results = await Promise.all([...])` is the common pattern.

## Time Budget
- Introduction: 2 min
- Part A (.then chains): 10 min
- Part B (async/await): 8 min
- Part C (Promise.all): 10 min
- Key insight: 3 min
- Bridge to React: 2 min
- **Total: ~35 min**
