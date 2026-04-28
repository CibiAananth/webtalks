# Exercise 02: Callback Hell — Speaker Notes

## Learning Objectives
- Experience the "pyramid of doom" firsthand
- Understand why nested callbacks become unmaintainable
- See the first appearance of the WATERFALL pattern
- Appreciate why Promises were invented

## Setup
Continuing from Exercise 01 — same API server should be running.

## Talk Track

### Introduction (~2 min)
"Exercise 01 took about 20 lines to make one request. jQuery's `$.get()` can do it in 5 lines. But the real challenge isn't one request — it's DEPENDENT requests."

"Your product manager wants a profile page showing:
1. User info
2. Their posts
3. Comments on their first post

Each piece depends on the previous. You can't fetch posts without the user ID. You can't fetch comments without the post ID."

### Part A: jQuery Cleanup (~5 min)
"First, let's see how jQuery simplifies Exercise 01."

Live code the `fetchUsers()` function:
```javascript
$.get("http://localhost:3069/api/users?delay=300", function(response) {
  renderUsers(response.data);
}).fail(function() {
  showError();
});
```

"That's it. 5 lines instead of 20. jQuery handles the XHR object, JSON parsing, everything."

**Ask:** "So jQuery solved AJAX. Why did we need Promises?"

### Part B: The Pyramid of Doom (~10 min)
"Now implement `fetchUserProfile()`. You need three sequential requests."

**Let participants struggle with this first** (5 min). Walk around and observe the code taking shape.

Then show the solution pattern:
```javascript
$.get("/api/users/1", function(userResponse) {
  renderUser(userResponse.data);

  $.get("/api/users/" + userResponse.data.id + "/posts", function(postsResponse) {
    renderPosts(postsResponse.data);

    const firstPost = postsResponse.data[0];
    $.get("/api/posts/" + firstPost.id + "/comments", function(commentsResponse) {
      renderComments(commentsResponse.data);
      // We're THREE levels deep now
    });
  });
});
```

**Key observations to make:**
1. "Look at the indentation. Code is drifting to the right."
2. "Each callback is nested inside the previous one."
3. "Where would you put error handling? You'd need `.fail()` at EVERY level."
4. "Want to add a 4th request? Another nesting level."

### The Waterfall (~5 min)
"Now open the Network tab and click 'Load User Profile'."

**Pause and let them watch.**

"See those three bars? They're SEQUENTIAL. Each request starts only after the previous one completes."

**Draw on whiteboard:**
```
Request 1: |████████|
Request 2:          |████████|
Request 3:                   |████████|
Total:     |-------------------------|
           0ms                    900ms
```

"This is the WATERFALL pattern. Three 300ms requests take 900ms total, not 300ms."

**Ask:** "Is this waterfall necessary? Can we avoid it?"

Answer: "For dependent data, no. We NEED the user ID before we can fetch posts. We NEED the post ID before we can fetch comments. This waterfall is inherent to the data dependencies."

### Key Takeaway (~3 min)
"Two problems here:
1. **Code structure** — the pyramid of doom. Hard to read, hard to maintain, error handling scattered everywhere.
2. **Runtime behavior** — the waterfall. Sequential requests when data depends on previous results."

"Promises (Exercise 03) will fix problem #1 — the code structure. But the waterfall remains whenever you have dependent data."

"This waterfall becomes the central challenge in React. Components that fetch their own data create hidden waterfalls that are much harder to spot."

## Common Questions

**Q: Can't we use Promise.all to parallelize?**
A: Only for INDEPENDENT requests. Here, each request depends on the previous result. Promise.all can't help.

**Q: This seems outdated. Who uses jQuery anymore?**
A: The pattern is what matters, not jQuery specifically. The same callback nesting happens with any callback-based API.

**Q: What if the first request fails?**
A: You'd need `.fail()` handlers at every level, or wrap everything in try-catch when we get to async/await.

## Time Budget
- Introduction: 2 min
- Part A (jQuery): 5 min
- Part B (Pyramid): 10 min
- Waterfall observation: 5 min
- Key takeaway: 3 min
- **Total: ~25 min**
