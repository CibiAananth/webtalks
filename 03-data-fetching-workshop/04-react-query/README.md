# Session 04: React Query & Suspense

This session explores what React Query **can** and **can't** fix. Spoiler: the structural waterfall is still there.

## Prerequisites

- Completed Session 03 (React & useEffect)
- Familiarity with React Query basics (useQuery, QueryClient)
- Understanding of the component waterfall problem

## Exercises

| Exercise | Topic | Key Insight |
|----------|-------|-------------|
| 09 | Query Waterfall | React Query doesn't fix structural waterfalls |
| 10 | Suspense | Suspense changes loading UX, not fetch timing |

## Setup

### 1. Start the API Server

```bash
cd ../01-php
php -S localhost:3069
```

### 2. Install Dependencies

```bash
cd ../04-react-query
npm install
```

### 3. Start the Dev Server

```bash
npm run dev
```

Open http://localhost:5174

## What You'll Learn

### Exercise 09: Query Waterfall
Compare three approaches side-by-side:
- **useEffect + fetch** — the classic waterfall
- **useQuery** — same waterfall, nicer API
- **Parallel fetching** — no waterfall, but prop drilling

**Key takeaway:** React Query solves caching, deduplication, and race conditions. But the structural waterfall is a component architecture problem, not a library problem.

### Exercise 10: Suspense
Explore Suspense with three patterns:
- **useQuery** — manual isLoading checks
- **Naive Suspense** — single boundary (still a waterfall!)
- **Sibling Suspense** — parallel boundaries for independent components

**Key takeaway:** Suspense changes *how* you write loading states (declarative fallbacks), not *when* fetches start. The waterfall persists because the component tree controls mount order.

## Key Concepts

### What React Query Solves
- ✅ Caching (don't re-fetch data you already have)
- ✅ Deduplication (two components, one request)
- ✅ Background refetching (stale-while-revalidate)
- ✅ Race conditions (automatic request cancellation)
- ✅ Retry logic (transient failure handling)

### What React Query Doesn't Solve
- ❌ Structural waterfalls (child can't fetch until parent renders)
- ❌ Component mount order (determined by React tree)
- ❌ Data dependencies (Comments need Post ID)

### What Suspense Actually Does
- ✅ Declarative loading states (no `if (isLoading)`)
- ✅ Code splitting integration
- ✅ Sibling parallelism (separate boundaries don't block each other)
- ❌ Magically parallelize nested fetches
- ❌ Change when components mount

## File Structure

```
04-react-query/
├── src/
│   ├── api.ts              # Typed fetch functions
│   ├── hooks.ts            # useQuery & useSuspenseQuery hooks
│   ├── App.tsx             # Routes
│   ├── main.tsx            # QueryClientProvider setup
│   ├── types.ts            # TypeScript interfaces
│   ├── styles.css          # Global styles
│   ├── context/
│   │   └── NetworkContext.tsx
│   ├── components/
│   │   ├── UserCard.tsx
│   │   ├── PostCard.tsx
│   │   ├── CommentCard.tsx
│   │   ├── Skeleton.tsx
│   │   ├── RequestLog.tsx
│   │   └── WaterfallChart.tsx
│   └── exercises/
│       ├── 09-query-waterfall/
│       │   ├── page.tsx
│       │   └── speaker-notes.md
│       └── 10-suspense/
│           ├── page.tsx
│           └── speaker-notes.md
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Running Tests

```bash
npm test
```

Or from the workshop root:

```bash
npm run exercise 09
npm run exercise 10
```

## What's Next?

The real solutions to structural waterfalls:

1. **Route Loaders** (Remix, React Router) — Fetch data at the route level, before components render
2. **Server Components** (Next.js) — Fetch on the server, stream to client
3. **Prefetching** — Start fetches before components mount

These approaches move data fetching out of the component tree, eliminating the structural waterfall entirely.
