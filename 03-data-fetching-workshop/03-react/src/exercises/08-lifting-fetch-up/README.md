# Exercise 08: Lifting Fetch Up

Eliminate the component waterfall by fetching at the page level.

## How to run

```bash
cd 03-react
npm run dev
```

Navigate to http://localhost:5173/08

## The challenge

Implement `ProfilePageProblem` to fetch data with Promise.all, then compare your waterfall chart with the solution.

### Requirements

1. Fetch user and posts in parallel using `Promise.all`
2. Fetch comments after posts (need first post ID)
3. Pass data down to display-only components
4. Call `onWaterfallUpdate(bars, totalTime)` to update the chart

## Expected result

- Exercise 07: ~2400ms (sequential)
- Exercise 08: ~1600ms (parallel user+posts, then comments)

## Trade-offs to understand

Read the insight box to understand why this approach has downsides:
- Components lose independence
- Page component becomes a data coordinator
- Loading is all-or-nothing
- Prop drilling in larger apps
