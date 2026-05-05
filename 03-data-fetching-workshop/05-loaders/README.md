# Session 05: Route Loaders

Route loaders fetch data **BEFORE** components render. No more component waterfalls.

## Setup

```bash
# From the project root, start the API server
npm run api

# In a new terminal, run this exercise
cd 05-loaders
npm install
npm run dev
```

Open http://localhost:5175

## Part 1: Demo

Navigate to http://localhost:5175/demo

See Suspense vs Route Loaders side by side:
- **Suspense tab**: User loads → then posts start loading (waterfall)
- **Route Loader tab**: User + posts load in parallel (no waterfall)

Watch the waterfall charts. Same data, same UI, different timing.

## Part 2: Exercise

Navigate to http://localhost:5175/exercise

1. Click a user to see their profile
2. Watch the 3-level waterfall: user → posts → comments
3. Open `src/routes/exercise/users.$userId.tsx`
4. Add a `loader` function that prefetches all the data
5. Compare with the solution: click "View Solution"

### File to edit

```
src/routes/exercise/users.$userId.tsx
```

### Hints

- Look at `src/routes/demo/with-loader.tsx` for the loader pattern
- Use `context.queryClient.ensureQueryData()` to prefetch
- Use `Promise.all()` for parallel fetches
- Comments depend on the first post ID (fetch sequentially after posts)

### Target

- **Before**: ~2400ms (user → posts → comments sequential)
- **After**: ~1600ms (user + posts + members parallel, then comments)

## Key concepts

1. **Route loaders** run before components mount
2. **ensureQueryData** checks cache first, fetches if needed
3. **Components** still use useQuery — they find cached data instantly
4. **pendingComponent** shows loading state during navigation (instead of per-component skeletons)
