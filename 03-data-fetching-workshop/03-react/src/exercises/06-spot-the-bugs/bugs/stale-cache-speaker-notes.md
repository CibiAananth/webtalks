# Bug #4: Stale Cache — Speaker Notes

## Time: 5 minutes

## The Bug

No caching means every mount triggers a fresh fetch, even if you just saw that data 2 seconds ago.

---

## Script

### Setup

> "Click any user in the list. Go back. Click the same user. Watch what happens."

### Demo

1. Click User 1 — wait for it to load
2. Click "Back to list"
3. Click User 1 again
4. Watch the request counter and loading spinner

### Explanation

> "You just saw User 1's data. It's still fresh — nothing changed in 3 seconds. But the component unmounted, lost its state, and fetched again."
>
> "Every single navigation = new request = loading spinner."

### User Experience Impact

> "On fast networks, this is annoying — a flash of loading state.
>
> On slow networks (mobile, poor connectivity), this is painful — users wait 2-3 seconds every time they go back.
>
> It also makes your app feel 'heavy' even when it shouldn't."

### Real-World Pattern

> "Think about browsing:
> - View list of items
> - Click item for details
> - Go back
> - Click same item
>
> Without caching, users see 4 loading spinners for 2 items. With caching, they see instant navigation after the first load."

### Why useState Can't Fix This

> "useState is component-scoped. When the component unmounts, the state is gone. There's nowhere to 'remember' the data."
>
> "You'd need to store it somewhere outside the component — in context, in a store, somewhere global. And then you're building your own caching layer."

### React Query Solution (Preview)

> "React Query has built-in caching with `staleTime`:

```tsx
const { data: user } = useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId),
  staleTime: 30000, // Data is fresh for 30 seconds
});
```

> "First visit: fetch and cache. Second visit within 30 seconds: instant from cache.
>
> After 30 seconds: show cached data immediately, refetch in background, update when done. Best of both worlds."

---

## Key Takeaway

> "Caching is table stakes for good UX. But implementing it correctly is hard:
> - When to invalidate?
> - How to update stale data?
> - How to handle errors with cached data?
>
> This is solved problem. Use a library."
