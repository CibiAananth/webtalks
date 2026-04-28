# Exercise 07: The Component Waterfall — Speaker Notes

## Overview

**Time estimate:** 10-12 minutes

**Goal:** Participants see how React's component model creates sequential fetch waterfalls, even when requests could run in parallel.

**Key teaching moment:** This is a fundamental architecture issue, not a coding mistake. The waterfall is baked into the component tree.

---

## Opening (2 minutes)

### What to say

> "In Exercise 04 (plain JS), we parallelized requests with Promise.all and cut our load time in half. Can we do the same thing in React?"
>
> "Let's see. We have three nested components: UserInfo, UserPosts, and PostComments. Each fetches its own data."

### The Setup

> "Look at the component tree:
> - `<UserInfo>` fetches the user
> - Inside UserInfo, `<UserPosts>` fetches posts
> - Inside UserPosts, `<PostComments>` fetches comments
>
> Standard React composition. Let's see what happens."

---

## The Demo (3 minutes)

### What to ask participants

> "Click 'Load Profile' and watch the waterfall chart."

### What happens

Three bars appear sequentially:
1. GET /users/1 (starts at 0ms)
2. GET /users/1/posts (starts after ~800ms)
3. GET /posts/1/comments (starts after ~1600ms)

Total time: ~2400ms

### Explanation

> "See the waterfall? Each request waits for the previous one to complete before starting."
>
> "User loads... then posts start. Posts load... then comments start. Sequential, not parallel."

---

## Why Can't We Just Use Promise.all? (3 minutes)

### The Question

> "In Exercise 04, we used Promise.all to parallelize. Why doesn't that work here?"

### The Answer

> "Because `<UserPosts>` doesn't **exist** until `<UserInfo>` renders it."
>
> "React renders top-down. UserInfo renders, its useEffect fires, data loads. Only THEN does UserInfo render UserPosts. Only THEN can UserPosts' useEffect fire."
>
> "The waterfall is baked into the component tree structure."

### Show the Code

Point to the component structure:

```tsx
function UserInfo({ userId }) {
  // ... fetch user ...
  return (
    <div>
      <UserCard user={user} />
      <UserPosts userId={user.id} />  {/* ← Renders AFTER user loads */}
    </div>
  );
}
```

> "UserPosts is in UserInfo's return. It can't exist until UserInfo has data to render."

---

## The Fundamental Tension (2 minutes)

### What to say

> "This isn't a bug to fix. It's a consequence of how React works:
> - Components fetch their own data (good for encapsulation)
> - Children render after parents (React's render model)
> - Therefore: nested fetches = waterfall"

### The Trade-off

> "We have two options:
> 1. **Component-level fetching**: Clean, independent components. But waterfalls.
> 2. **Page-level fetching**: Fast parallel fetches. But coupled, messy code.
>
> Exercise 08 explores option 2. Sessions 04-06 show how libraries solve this."

---

## Transition to Exercise 08 (1 minute)

### What to say

> "What if we moved ALL the fetching to the page level? Fetch user and posts in parallel, then comments?"
>
> "That's Exercise 08. We'll eliminate the waterfall — but see what we lose in the process."

---

## Common Questions

**"What if I fetch in the parent and pass data down?"**
> "That's exactly Exercise 08. It works, but creates tight coupling and prop drilling."

**"Can't Suspense fix this?"**
> "Suspense changes loading states but doesn't parallelize fetches. You need a data layer that knows to prefetch."

**"What about React Server Components?"**
> "RSC can help by moving fetching to the server and streaming. But for client components, the waterfall issue remains. We'll cover RSC in Session 06."

---

## Key Metrics to Highlight

| Pattern | Requests | Total Time |
|---------|----------|------------|
| Sequential (waterfall) | 3 | ~2400ms |
| Parallel (user + posts) | 2+1 | ~1600ms |

> "Moving two requests in parallel saves 800ms — a 33% improvement. For a real app with more requests, the savings compound."
