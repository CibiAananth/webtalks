# Bug #1: Race Condition — Speaker Notes

## Time: 5 minutes

## The Bug

When you rapidly switch between users, responses arrive out of order. The last response wins, not the last click.

---

## Script

### Setup

> "Let's trigger a race condition. On the Buggy side, click User 1, then immediately click User 5."

### Demo

1. Click User 1
2. Immediately click User 5 (before User 1 loads)
3. Watch — you might see User 1's data flash briefly after User 5 loads

### Explanation

> "Both requests fired. The server doesn't know you clicked away. When User 1's response finally arrives, it calls `setUser` — overwriting User 5."
>
> "This is subtle. In our demo with 1.5s delays, you can see it. In production with varying network speeds, it happens randomly and is hard to reproduce."

### Real-World Impact

> "Imagine a search-as-you-type feature. User types 'app', then 'apple'. If 'app' results arrive after 'apple' results, users see wrong results."
>
> "Or a dashboard with filters. Change filter A, then filter B quickly. Wrong data appears."

### The Fix

Click "Show Fix":

```tsx
useEffect(() => {
  const controller = new AbortController();

  trackedFetch(url, { signal: controller.signal })
    .then(r => r.json())
    .then(data => {
      setUser(data.data);
      setIsLoading(false);
    })
    .catch(err => {
      if (err.name !== 'AbortError') {
        console.error(err);
      }
    });

  return () => controller.abort();
}, [userId]);
```

### Key Points

1. **AbortController** — native browser API for cancelling requests
2. **Cleanup function** — runs when userId changes or component unmounts
3. **AbortError handling** — ignore the abort error, it's intentional

### Try It

> "Now try the same thing on the Fixed side. Click User 1, then User 5 quickly. No flash — the old request is cancelled."

---

## Common Questions

**"Can I use a boolean flag instead of AbortController?"**
> "A flag (`let cancelled = false`) prevents setState but doesn't cancel the actual request. The network request still completes, wasting bandwidth. AbortController actually cancels."

**"What about fetch polyfills?"**
> "AbortController is widely supported now (all modern browsers). For legacy support, you might need a polyfill, but the flag approach works as a fallback."
