# Session 03: React & the useEffect Era

This session transitions from plain HTML/JS to a React + TypeScript app with Vite. You'll build the `useEffect + fetch` pattern, discover its hidden bugs, see the component waterfall problem, and understand why the community moved beyond it.

## Prerequisites

- Node.js 18+
- The mock API server running (from the workshop root)

## Setup

```bash
# From this directory (03-react/)
npm install
```

## Running the Exercises

### 1. Start the API server (in a separate terminal)

From the workshop root directory:

```bash
npm run api
# Runs on http://localhost:3069
```

### 2. Start the React dev server

```bash
npm run dev
# Opens on http://localhost:5173
```

### 3. Navigate to exercises

- http://localhost:5173/05 — Exercise 05: useEffect + fetch
- http://localhost:5173/06 — Exercise 06: Spot the Bugs
- http://localhost:5173/07 — Exercise 07: Component Waterfall
- http://localhost:5173/08 — Exercise 08: Lifting Fetch Up

## Exercises Overview

### Exercise 05: useEffect + fetch

Build the basic data fetching pattern step by step:

1. **Step 1** — Fetch data and render it
2. **Step 2** — Add loading state with skeleton
3. **Step 3** — Add error handling
4. **Step 4** — See the complete pattern

Edit files in `src/exercises/05-useeffect-fetch/steps/` — the browser hot-reloads.

### Exercise 06: Spot the Bugs

Interactive demos of hidden bugs in the "correct" useEffect + fetch pattern:

- **Bug #1** — Race condition (rapidly switching users)
- **Bug #2** — Memory leak (unmounting mid-fetch)
- **Bug #3** — Duplicate requests (multiple components, same data)
- **Bug #4** — Stale cache (no caching, constant refetching)

### Exercise 07: Component Waterfall

See how nested components create sequential fetch waterfalls. Watch the waterfall chart as three requests fire one after another instead of in parallel.

### Exercise 08: Lifting Fetch Up

Implement page-level fetching to eliminate the waterfall. Learn the trade-offs: better performance but loss of component independence.

## Running Tests

From the workshop root directory:

```bash
# Run the structure tests for this session
npx vitest run 03-react/src/exercises/exercises.test.ts

# Run all workshop tests
npm test
```

## Project Structure

```
03-react/
├── src/
│   ├── main.tsx              # App entry point
│   ├── App.tsx               # Router setup
│   ├── types.ts              # Shared TypeScript types
│   ├── styles.css            # Global styles
│   ├── context/
│   │   └── NetworkContext.tsx  # Request tracking context
│   ├── components/           # Reusable UI components
│   │   ├── Skeleton.tsx
│   │   ├── ErrorMessage.tsx
│   │   ├── UserCard.tsx
│   │   ├── PostCard.tsx
│   │   ├── CommentCard.tsx
│   │   ├── NetworkIndicator.tsx
│   │   ├── RequestLog.tsx
│   │   ├── WaterfallChart.tsx
│   │   └── BugScenario.tsx
│   └── exercises/
│       ├── 05-useeffect-fetch/
│       ├── 06-spot-the-bugs/
│       ├── 07-component-waterfall/
│       └── 08-lifting-fetch-up/
├── package.json
├── tsconfig.json
├── vite.config.ts
└── index.html
```

## TypeScript

This session uses TypeScript throughout. Key types are in `src/types.ts`:

- `User` — User profile data
- `Post` — Blog post data
- `Comment` — Post comment data
- `ApiResponse<T>` — API response wrapper
- `RequestLogEntry` — Network request tracking

## Network Tracking

The `NetworkContext` provides a `trackedFetch` function that logs all requests to the Network Log panel visible in each exercise. Use this instead of raw `fetch()` when you want requests to appear in the log.

```tsx
import { useNetwork } from "../context/NetworkContext";

function MyComponent() {
  const { trackedFetch } = useNetwork();

  useEffect(() => {
    trackedFetch("http://localhost:3069/api/users/1")
      .then(r => r.json())
      .then(data => /* ... */);
  }, []);
}
```

## Teaching Philosophy

This session emphasizes **discovery through hands-on coding**:

- Each exercise builds on the previous one
- Problems are revealed through interaction, not lecture
- Solutions are available but hidden by default
- The goal is to understand *why* patterns evolved, not just *how* to use them

## What's Next

After completing this session, you'll understand why the community developed solutions like:

- **React Query / TanStack Query** — Automatic caching, deduplication, and background refetching
- **Route loaders** — Fetching tied to URLs instead of component trees
- **Server Components** — Moving data fetching to the server entirely

These are covered in Sessions 04-06.
