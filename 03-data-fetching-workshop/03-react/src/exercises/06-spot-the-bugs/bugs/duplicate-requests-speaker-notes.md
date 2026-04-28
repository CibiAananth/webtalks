# Bug #3: Duplicate Requests — Speaker Notes

## Time: 4 minutes

## The Bug

Multiple components needing the same data each fetch independently. No request deduplication.

---

## Script

### Setup

> "Here are three components: UserGreeting, UserSidebar, and UserBadge. All three need User 1's data."

### Demo

Just look at the counter — it shows 3 requests to `/api/users/1`.

> "Each component fetched independently. Three requests for the exact same data."

### Explanation

> "Each component is isolated. It has its own useState, its own useEffect. It doesn't know other components exist."
>
> "This is by design — components are meant to be independent and reusable. But for data fetching, it's wasteful."

### Real-World Example

> "Think about a typical app layout:
> - Header shows user name and avatar
> - Sidebar shows user profile preview
> - Main content shows user details
> - Footer shows user membership status
>
> Four components, four fetches, one user. On mobile with slow connections, this is painful."

### Why There's No Fix

> "Within the useEffect pattern, there's no good solution:
> - **Lift to parent + prop drill**: Works, but messy. Parent becomes a data coordinator.
> - **Context**: Kinda works, but now you're building your own state management.
> - **Redux/Zustand**: Heavy for just deduplication.
>
> None of these are ergonomic. You just want components to share data automatically."

### React Query Solution (Preview)

> "This is exactly what React Query's query key solves. Same key = same data = one request:

```tsx
// In all three components:
const { data: user } = useQuery({
  queryKey: ['user', 1],
  queryFn: () => fetchUser(1)
});
```

> "Three components, one request. React Query deduplicates automatically. We'll cover this in Session 04."

---

## Key Takeaway

> "Component isolation is great for UI composition but terrible for data fetching coordination. You need something above the component level to deduplicate."
