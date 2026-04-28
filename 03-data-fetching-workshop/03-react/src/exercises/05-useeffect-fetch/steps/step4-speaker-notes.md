# Step 4: The Complete Pattern — Speaker Notes

## Time: 5 minutes

## Setup

- Browser at http://localhost:5173/05/step-4
- No coding — this is a reference and discussion step

---

## Script

### Opening (1 minute)

> "This is it — the 'correct' useEffect + fetch pattern. Loading, errors, cleanup, re-fetch on prop change. All the pieces we've built."

### Code Walkthrough (2 minutes)

Scroll through the code and highlight:

**The cancelled flag:**
```tsx
const loadUser = useCallback(() => {
  let cancelled = false;
  // ... fetch logic ...
  if (!cancelled) {
    setUser(data.data);
  }
  return () => { cancelled = true; };
}, [userId, trackedFetch]);
```

> "This prevents setting state if the component unmounts or the userId changes mid-fetch. We'll see why this matters in Exercise 06."

**The useCallback:**
> "We wrap `loadUser` in useCallback so it only changes when userId changes. This lets us use it as a dependency and as a retry handler."

**The cleanup return:**
> "useEffect can return a cleanup function. React calls it when the component unmounts or before re-running the effect."

### The Uncomfortable Question (2 minutes)

> "Count the lines. About 40 lines of code for **one fetch**. Is this really the best we can do?"

Read the bullet points from the insight box:

> "And even with all this code, we still have problems:
> - What if you click between users really fast?
> - What if you unmount mid-fetch?
> - What if three components on the page need this same user?
> - What if you navigate away and come back?
>
> These aren't hypotheticals. Let's go see them happen."

### Interactive Demo

Let participants play with the component:
- Click through different users
- Try clicking 999 for error
- Click Retry

> "It works. It's correct. But it's a lot of code, and it still has hidden issues."

### Transition to Exercise 06

> "Head to Exercise 06. We're going to trigger each of these bugs and see them in action. Then you'll understand why React Query exists."

---

## Key Points to Land

1. **The pattern is verbose** — 40 lines for one fetch
2. **Every component needs this** — multiply by every fetch in your app
3. **It still has bugs** — race conditions, memory leaks, duplicate requests, no caching
4. **This is why libraries exist** — React Query, SWR, etc. solve these problems

## Don't Say Yet

- Don't explain the bugs in detail — let Exercise 06 reveal them
- Don't mention React Query solutions — that's Session 04
- Don't criticize useEffect itself — it's the right primitive, just low-level

## Mindset to Create

Participants should feel:
- "Wow, this is a lot of code"
- "Wait, there are still bugs?"
- "Curious what those bugs look like"

Not:
- "This is stupid, why use useEffect at all"
- "I'll just use axios and be done" (doesn't solve the real problems)
