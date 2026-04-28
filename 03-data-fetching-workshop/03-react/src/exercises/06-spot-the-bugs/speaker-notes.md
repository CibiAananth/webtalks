# Exercise 06: Spot the Bugs — Speaker Notes

## Overview

**Time estimate:** 20-25 minutes total

**Goal:** Participants see and understand the hidden bugs in useEffect + fetch that aren't obvious from looking at code alone.

**Key teaching moment:** These bugs happen in every production React app. They're not edge cases — they're fundamental limitations of the pattern.

---

## Opening (2 minutes)

### What to say

> "In Exercise 05, we built what looks like correct code. Loading states, error handling, cleanup — all there. But there are bugs hiding in plain sight."
>
> "We're going to trigger each one. This isn't theoretical — these bugs ship to production constantly because they're hard to spot in code review."

### Setting expectations

> "This exercise is interactive. I'll walk you through each bug scenario. Your job is to trigger the bug, see it happen, then we'll look at the fix."

---

## Bug #1: The Race Condition (5 minutes)

### Setup

Click on "Bug #1: The Race Condition" to expand it.

### What to say

> "Classic race condition. You click User 1, then quickly click User 5 before User 1 loads. What happens?"

### What to ask participants

> "Try it. Click User 1, then immediately click User 5. Watch the Buggy side. What do you see?"

### What happens

User 1's response arrives after you've switched to User 5. For a moment, User 1's data flashes on screen even though you're looking at User 5.

### Explanation

> "Both requests fired. User 5 responded first (randomly), so we showed it. Then User 1's response arrived and overwrote it — even though we don't care about User 1 anymore."
>
> "This is a **race condition**. The last response wins, not the last click."

### The Fix

Click "Show Fix" and explain:

> "The fix uses `AbortController`. When userId changes, the cleanup function aborts the old request. The stale response never calls setState."

```tsx
useEffect(() => {
  const controller = new AbortController();

  fetch(url, { signal: controller.signal })
    .then(/* ... */)
    .catch(err => {
      if (err.name !== 'AbortError') console.error(err);
    });

  return () => controller.abort();
}, [userId]);
```

### Key point

> "Notice we have to handle `AbortError` specially — it's not a real error, it's us cancelling on purpose."

---

## Bug #2: The Memory Leak (5 minutes)

### Setup

Click on "Bug #2: The Memory Leak" to expand it.

### What to say

> "What if you unmount a component while it's still fetching? The fetch is in-flight, the component is gone..."

### What to ask participants

> "Click Mount, then quickly click Unmount before it finishes loading (3 second delay). Watch the network log."

### What happens

The request completes even though the component is gone. In React 18+, you might see a warning about setting state on an unmounted component.

### Explanation

> "The fetch doesn't know or care that the component unmounted. It finishes, tries to call setState, and... nothing good happens."
>
> "This is wasted bandwidth at best, and memory leaks or crashes at worst."

### The Fix

Same as Bug #1 — AbortController:

> "When the component unmounts, the cleanup function runs and aborts the request. No wasted bandwidth, no setState on unmounted components."

---

## Bug #3: The Duplicate Requests (4 minutes)

### Setup

Click on "Bug #3: The Duplicate Requests" to expand it.

### What to say

> "Look at these three components. They all need User 1's data. Each one fetches independently. Watch the counter."

### What happens

Three requests to `/api/users/1` — the counter shows 3 (or more if you've been clicking around).

### Explanation

> "Each component is independent. It doesn't know other components exist. So each one fetches the same data separately."
>
> "In a real app, you might have a header showing the user's name, a sidebar showing their avatar, and a main content area showing their profile. Three fetches for one user."

### The Non-Fix

> "There's no fix within useEffect. You could lift the fetch to a parent and prop-drill, but that's messy. You could use Redux, but that's heavy."
>
> "This is exactly what React Query solves — automatic request deduplication. Same key = same request = shared response."

---

## Bug #4: The Stale Cache (5 minutes)

### Setup

Click on "Bug #4: The Stale Cache" to expand it.

### What to say

> "Click a user. Go back. Click the same user. Watch the network log."

### What to ask participants

> "Navigate back and forth between the list and a user detail a few times. How many requests do you see?"

### What happens

Every navigation makes a new request. The counter keeps growing.

### Explanation

> "There's no cache. When a component unmounts, its state is gone. Come back, start fresh, fetch again."
>
> "On mobile with slow networks, this means loading spinners every single time you go back. Terrible UX."

### The Non-Fix

> "Again, no fix within useEffect. You'd need to implement caching yourself — in context, in a store, somewhere outside the component."
>
> "React Query gives you caching with `staleTime` — show cached data instantly, refetch in background if stale."

---

## Wrap-Up (3 minutes)

### The Real Problem

> "These aren't edge cases. These happen in every non-trivial React app:
> - Race conditions when users click fast
> - Wasted requests when navigating quickly
> - Duplicate requests when data is needed in multiple places
> - No caching means constant refetching"

### Why This Matters

> "The useEffect + fetch pattern forces you to solve caching, deduplication, race conditions, and cleanup **manually, in every component**."
>
> "This is exactly why React Query, SWR, and similar libraries were created. They solve all of this automatically."

### Transition to Exercise 07

> "But before we look at solutions, there's one more problem. It's not about bugs — it's about performance. The **component waterfall**. Let's go see it."

---

## Common Questions

**"Can't I just use axios?"**
> "Axios has nicer syntax but doesn't solve any of these problems. You still need to manage loading, errors, caching, deduplication yourself."

**"What about React Suspense?"**
> "Suspense changes how you handle loading states but doesn't solve caching or deduplication. You still need a data fetching library."

**"Is useEffect bad?"**
> "No! It's the right primitive for side effects. It's just low-level. You wouldn't write raw SQL for every database query — you'd use an ORM. Same idea."
