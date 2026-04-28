# Exercise 06: Spot the Bugs

Discover the hidden bugs in useEffect + fetch.

## How to run

```bash
cd 03-react
npm run dev
```

Navigate to http://localhost:5173/06

## Bugs covered

1. **Race Condition** - Rapidly switching between users causes stale data
2. **Memory Leak** - Unmounting mid-fetch attempts setState on unmounted component
3. **Duplicate Requests** - Multiple components fetching the same data
4. **Stale Cache** - No caching means constant refetching

## Learning objectives

- Understand that "correct" useEffect + fetch still has hidden bugs
- Learn to recognize these issues in production code
- See why React Query and similar tools exist
