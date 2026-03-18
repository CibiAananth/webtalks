# Exercise 02: Callback Hell — When AJAX Gets Complicated

## Context

Exercise 01 took 30 lines to make a single GET request. jQuery's `$.ajax()` can do
the same in 5 lines. But the real challenge isn't one request — it's **dependent
requests**.

Your product manager wants a user profile page that shows:
1. The user's info
2. Their blog posts
3. Comments on their first post

Each request **depends on data from the previous one**:
- You can't fetch posts without knowing the user ID
- You can't fetch comments without knowing the post ID

This is where "callback hell" begins.

## Your Task

This exercise has two parts:

### Part A — Simple jQuery AJAX

Implement `fetchUsers()` using jQuery `$.get()`. This demonstrates how much cleaner
jQuery is compared to raw XHR. What took 30 lines in Exercise 01 is now ~5 lines.

### Part B — Nested Callbacks (The Main Event)

Implement `fetchUserProfile()` to fetch data in sequence:

1. `GET /api/users/1?delay=300` → Get the user
2. `GET /api/users/{userId}/posts?delay=300` → Get their posts (needs user.id from step 1)
3. `GET /api/posts/{postId}/comments?delay=300` → Get comments on first post (needs post.id from step 2)

**You MUST use nested callbacks**, not Promises or async/await. The goal is to
experience the "pyramid of doom" firsthand.

## What to Observe

1. **Open the Network panel** in DevTools before clicking "Load User Profile"
2. Watch the **3 requests fire SEQUENTIALLY**, not in parallel
3. Each waits for the previous to finish — total time is ~900ms (3 × 300ms)
4. This is the **WATERFALL pattern** we'll keep talking about in later sessions
5. Look at your code — the indentation drifts right with each nesting level

The "pyramid of doom":
```js
$.get(url1, function(response1) {
  // First level
  $.get(url2, function(response2) {
    // Second level - indented further
    $.get(url3, function(response3) {
      // Third level - even further right
      // This is callback hell
    });
  });
});
```

## Hints

jQuery AJAX basics:
```js
// Simple GET request
$.get(url, function(response) {
  // response is already parsed JSON
  console.log(response.data);
}).fail(function(xhr) {
  // Error handling
  console.error("Failed:", xhr.status);
});

// Or the longer form
$.ajax({
  url: url,
  method: "GET",
  success: function(response) { ... },
  error: function(xhr) { ... }
});
```

API response format: `{ data: ... }`

## How to Check Your Solution

```bash
# Terminal 1: Start the API server
npm run api

# Terminal 2: Run the tests
npm run exercise 02
```

Or open `problem.html` in your browser and:
1. Click "Load Team" — should show 5 users (Part A)
2. Click "Load User Profile" — should show user info, posts, and comments (Part B)
3. Check the total time display — should be ~900ms (3 sequential 300ms requests)

## Key Takeaway

jQuery made AJAX much cleaner than raw XHR. But when you need **dependent requests**,
you end up nesting callbacks inside callbacks. This is:
- Hard to read (code drifts right)
- Hard to maintain (error handling scattered everywhere)
- Hard to extend (adding a 4th request means another nesting level)

**Bridge to Exercise 03:** In the next exercise, you'll rewrite this exact same
logic using Promises and async/await — and see how it flattens the pyramid. But
the waterfall (sequential requests) will remain. We'll tackle that later with
`Promise.all()`.
