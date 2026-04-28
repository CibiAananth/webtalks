# Exercise 08: Lifting Fetch Up — Speaker Notes

## Overview

**Time estimate:** 15-20 minutes

**Goal:** Participants implement page-level fetching to eliminate the waterfall, then understand the trade-offs.

**Key teaching moment:** Page-level fetching solves performance but creates new problems. There's no free lunch — this is why data fetching libraries exist.

---

## Opening (2 minutes)

### What to say

> "Exercise 07 showed us the waterfall problem. The fix seems obvious: don't let components fetch their own data. Fetch everything at the page level and pass it down."
>
> "Let's try it. You'll implement page-level fetching and see the waterfall disappear."

### The Goal

> "We want:
> - User and posts to fetch **in parallel** (Promise.all)
> - Comments to fetch **after** posts (we need the first post ID)
>
> Instead of ~2400ms, we should get ~1600ms."

---

## The Task (10-12 minutes)

### What to ask participants

> "Open `src/exercises/08-lifting-fetch-up/page.tsx`. Find `ProfilePageProblem`."
>
> "Your task:
> 1. Fetch user and posts in parallel with Promise.all
> 2. Fetch comments after posts (you need `postsData.data[0].id`)
> 3. Set state for user, posts, and comments
> 4. Call `onWaterfallUpdate(bars, totalTime)` to update the chart
> 5. Render using the display-only components (UserInfoDisplay, etc.)"

### Starter Hints

> "Look at the display components at the top — they just take data as props, no fetching.
>
> For the waterfall bars, track start times with `Date.now()` and calculate durations."

### Let Them Work

Walk around and help. Common issues:

**"How do I track timing for the chart?"**
```tsx
const totalStart = Date.now();
const bars = [];

const phase1Start = Date.now();
const [userData, postsData] = await Promise.all([...]);
const phase1Duration = Date.now() - phase1Start;

bars.push({ label: "GET /users/1", start: 0, duration: phase1Duration, color: "#6c63ff" });
bars.push({ label: "GET /posts", start: 0, duration: phase1Duration, color: "#4ade80" });
```

**"TypeScript is complaining about the array access"**
> "Use optional chaining or check length. The API always returns data, but TypeScript doesn't know that."

### Review (3 minutes)

Click "Show Solution" and compare:

> "Look at the two waterfall charts. Your version should show user and posts bars overlapping at the start."

Highlight the solution structure:

```tsx
// Phase 1: Parallel
const [userData, postsData] = await Promise.all([
  trackedFetch("/users/1"),
  trackedFetch("/users/1/posts"),
]);

// Phase 2: Sequential (needs post ID)
const commentsData = await trackedFetch(`/posts/${postsData.data[0].id}/comments`);
```

---

## The Trade-offs Discussion (5 minutes)

### What to say

> "We eliminated the waterfall. Great! But look at what we lost..."

### Walk through the insight box

**1. Components lost independence**

> "UserInfoDisplay can't fetch its own data. Drop it on another page and someone else has to provide the data. It's no longer self-contained."

**2. The page knows too much**

> "This page component manages users, posts, AND comments. Three pieces of state, three endpoints. Add a fourth section? Add more state and fetches here."

**3. Loading is all-or-nothing**

> "Everything shows a skeleton until everything is ready. In the old version, the user appeared first, then posts, then comments — progressive loading."

**4. Prop drilling**

> "Here it's fine — one level deep. In a real app with 20 components and 5 levels of nesting, you're threading data through everything."

### The Fundamental Tension

> "This is the core problem:
> - **Component-level fetching**: Clean components, waterfalls
> - **Page-level fetching**: Fast loading, messy code
>
> You're trading one problem for another."

---

## What's Next (2 minutes)

### React Query Preview

> "React Query gives you the best of both worlds:
> - Components fetch their own data (clean, independent)
> - Requests automatically deduplicate (no duplicates)
> - Smart caching (no waterfalls on subsequent renders)
>
> Same ergonomics as useEffect, none of the problems."

### Route Loaders Preview

> "Route loaders (React Router, Remix, Next.js) take a different approach:
> - Fetching tied to URLs, not components
> - Data loads before the page renders
> - No waterfalls because fetching happens before React starts
>
> We'll cover both in Sessions 04-06."

---

## Wrap-up

### Key Takeaways

1. Page-level fetching eliminates waterfalls
2. But creates coupling and loses progressive loading
3. Neither approach is ideal alone
4. This is why data fetching libraries exist

### Transition

> "That's the end of Session 03. We've seen:
> - How to do useEffect + fetch (Exercise 05)
> - Why it has hidden bugs (Exercise 06)
> - Why component-level fetching creates waterfalls (Exercise 07)
> - Why page-level fetching isn't perfect either (Exercise 08)
>
> In Session 04, we'll see how React Query solves all of this."

---

## Common Questions

**"Which approach should I use in production?"**
> "Use a library. React Query for most cases, route loaders if your framework supports them. Don't write this by hand."

**"What about Redux?"**
> "Redux can hold fetched data but doesn't handle fetching itself. You'd use something like RTK Query, which is similar to React Query."

**"Is useEffect bad?"**
> "No! It's the right primitive. But it's low-level. Use it for non-data-fetching side effects. For data, use a library."
