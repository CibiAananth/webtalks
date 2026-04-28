# Exercise 09: Query Waterfall — Speaker Notes

## Learning Objectives
- Understand that React Query doesn't fix structural waterfalls
- See the exact same waterfall pattern with useQuery as with useEffect
- Recognize that the waterfall is a component architecture problem

## Setup (~2 min)
1. Make sure the API server is running: `cd 01-php && php -S localhost:3069`
2. Start the React Query app: `cd 04-react-query && npm run dev`
3. Open http://localhost:5174/09

## Talk Track

### Introduction (~3 min)
"In Session 03, we saw the component waterfall problem. Each component fetched when it mounted, creating a chain of sequential requests. Now you're thinking — doesn't React Query fix this? It handles caching, deduplication, all that good stuff. Let's find out."

### Tab 1: useEffect (~3 min)
"First, let's see the baseline. Click 'Run' with the useEffect tab active."

**Ask participants:** "Watch the waterfall chart. What pattern do you see?"

Expected answer: Sequential bars — User loads, then Posts, then Comments.

"Right. This is the same pattern from Session 03. Each component fetches when it renders. The child can't fetch until the parent finishes because the child doesn't exist yet."

### Tab 2: useQuery (~5 min)
"Now switch to the useQuery tab and click 'Reload'."

**Pause for effect.** "Look at the waterfall chart. What's different?"

Expected answer: Nothing. Same sequential pattern.

**Key teaching moment:**
"The waterfall is identical. Why? Because React Query solves *different problems*:
- Caching — don't re-fetch data you already have
- Deduplication — two components asking for the same data get one request
- Background refetching — stale-while-revalidate
- Retry logic — handle transient failures

But React Query can't change *when your components mount*. QueryPosts doesn't exist in the React tree until QueryUserInfo finishes loading. That's a structural issue, not a library issue."

### Tab 3: Parallel (~3 min)
"Now let's see the 'Parallel' tab. Click 'Reload'."

**Ask participants:** "What's different in the waterfall?"

Expected answer: All three bars start at the same time.

"All requests fire immediately in parallel. Total time is ~800ms instead of ~2400ms. But look at the code — we had to lift all fetching to the top component. Same trade-off as Exercise 08: no waterfall, but now we have prop drilling and tightly-coupled components."

### Discussion (~5 min)
"So here's the uncomfortable truth: React Query is fantastic, but it's not magic. It solves caching and deduplication beautifully. But the structural waterfall? That's a component architecture problem."

**Write on whiteboard:**
- useEffect + fetch: Waterfall ✓
- useQuery: Waterfall ✓ (same problem, nicer API)
- Parallel/lifted: No waterfall, but prop drilling

"In Exercise 10, we'll explore Suspense. Does that change anything?"

## Common Questions

**Q: Can't I prefetch data to avoid the waterfall?**
A: Yes! `queryClient.prefetchQuery()` can start fetches before components mount. But where do you call it? You need to know what data to fetch before rendering. This leads to route loaders (Remix, Next.js), which we'll cover later.

**Q: What about dependent queries?**
A: Sometimes waterfalls are unavoidable. If Comments require the first post's ID, you genuinely can't fetch Comments until Posts loads. That's a data dependency, not a library limitation.

## Time Budget
- Setup: 2 min
- Introduction: 3 min
- Tab 1 (useEffect): 3 min
- Tab 2 (useQuery): 5 min
- Tab 3 (Parallel): 3 min
- Discussion: 5 min
- **Total: ~21 min**
