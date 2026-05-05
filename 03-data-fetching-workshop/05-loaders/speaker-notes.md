# Session 05: Route Loaders — Speaker Notes

## Learning Objectives
- Understand the **mount-to-fetch gap** — the real problem with client-side data fetching
- Learn how route loaders start fetching at **navigation time**, not mount time
- See how `queryClient.ensureQueryData()` bridges loaders and React Query
- Recognize the conceptual return to server-rendered patterns (with client-side benefits)

## Prerequisites
- Participants have completed Sessions 03-04 (React Query, Suspense)
- They understand sibling Suspense boundaries enable parallel fetching
- They know Suspense changes loading states, not fetch timing

## Setup
```bash
# Terminal 1: API server (from project root)
npm run api

# Terminal 2: This exercise
cd 05-loaders
npm install
npm run dev
```

Open http://localhost:5175

---

## The Waterfall Problem — Deeper Explanation

**Use this if participants ask "why is sibling Suspense not good enough?"**

### The Mount-to-Fetch Gap

The trap with client-side Suspense isn't siblings — it's **when fetches start**. A component can only kick off its fetch *after it mounts*, and it only mounts after:

```
[ JS download ][ parse ][ hydrate ][ render App ][ mount User+Posts ][ fetch ][ render ]
                                                                      ↑ fetch starts HERE
```

Even with sibling Suspense doing parallel fetches, those fetches don't START until after all that work. On localhost with cached JS, mount is instant. In production with a 200KB bundle over 3G? That's 2+ seconds before fetches even begin.

### What Loaders Change

```
[ click link ][ loader: fetch user || fetch posts ][ render with data ]
              ↑ fetch starts HERE
```

The moment the user clicks, the loader fires. No waiting for JS bundle, hydration, or component mount. The fetch-start point moves from "after mount" to "at navigation."

### Dependent Fetches (posts → comments)

Both approaches must await posts before fetching comments. But there's still a difference:

**With Suspense:**
```
posts resolves → React renders Posts → mounts Comments → runs useEffect → fetch starts
                 |_______________________________________________|
                              frames of work (16-100ms)
```

**With Loader:**
```js
const posts = await fetchPosts();
const comments = await fetchComments(posts[0].id);  // microseconds later
```

Just `await` → `await` in the same async function. No render cycle between them.

---

## Part 1: Demo (~15 minutes)

### Introduction (~3 min)

**What to say:**

> "Last session we saw that sibling Suspense boundaries enable parallel fetching. But there's a catch we didn't discuss: WHEN do those fetches actually start?"
>
> "With Suspense, fetches start when components MOUNT. Mount happens after JS download, parse, hydration, and render. On a slow connection, that's seconds of delay."
>
> "Route loaders change this. Fetches start at NAVIGATION time — the moment you click the link. Let's see the difference."

Navigate to http://localhost:5175/demo

### Suspense Tab Demo (~4 min)

**What to do:**
1. Click "Suspense" tab
2. Open the browser's **Network tab** (DevTools → Network)
3. Click "Reload (clear cache)"

**What to observe:**
- Network tab: User and Posts start at the SAME time (parallel!)
- Total fetch time: ~800ms
- UI: You see skeletons, then content pops in

**What to say:**

> "Watch the Network tab. User and Posts start together — parallel fetches. The fetch time is 800ms."
>
> "But here's the thing we can't easily see on localhost: those fetches only started AFTER the component mounted. On localhost with cached JS, mount is instant. In production? Mount might be 2 seconds after navigation."
>
> "The skeletons you see aren't just a UX choice — they represent real waiting time."

### Route Loader Tab Demo (~4 min)

**What to do:**
1. Click "Route Loader" tab
2. Keep the Network tab open
3. Click "Reload (clear cache)"

**What to observe:**
- Network tab: Same parallel fetches, same ~800ms
- UI: NO skeletons! Page appears complete.

**What to say:**

> "Same fetches, same 800ms. But no skeletons — the page appears complete."
>
> "The difference we CAN'T see on localhost is more important: these fetches started at NAVIGATION time. The moment you clicked the tab, the loader fired. No waiting for JS or React."
>
> "In production, that's the difference between 'fetch starts immediately' and 'fetch starts 2 seconds later'."

### Explain the Timing (~4 min)

**What to say:**

> "Let me explain the timeline difference."
>
> "SUSPENSE: Click → download JS → parse → hydrate → mount → FETCH → render"
> "LOADER: Click → FETCH → (JS downloads in parallel) → render with data"
>
> "The loader moves fetch-start from 'after mount' to 'at navigation'. Everything else can happen while data is loading."

**Show the code** (`src/routes/demo/with-loader.tsx`):

```tsx
loader: async ({ context, location }) => {
  const userId = location.search.userId ?? 1

  await Promise.all([
    context.queryClient.ensureQueryData(userQueryOptions(userId)),
    context.queryClient.ensureQueryData(userPostsQueryOptions(userId)),
  ])
}
```

> "The loader runs immediately on navigation. It populates the React Query cache. When components finally mount, they find cached data — instant render, no suspension."

---

## Part 2: Exercise (~25 minutes)

### Exercise Flow

**Important:** We demo the SOLUTION first, then show the problem. This way participants know exactly what they're building.

### Step 1: Navigate to Exercise (~1 min)

Navigate to http://localhost:5175/exercise

**What to say:**

> "Now you're going to add a loader yourself. But first, let me show you what you're building."

Click on **User 1** (which links directly to the solution).

### Step 2: Demo the Solution First (~5 min)

**What to do:**
1. You're now on the **Solution** page
2. Open the **Network tab**
3. Select a different user to trigger a fresh load

**What to observe:**
- Phase 1: user, posts, and members all start at 0ms (parallel)
- Phase 2: comments starts at ~800ms (after posts)
- Total: ~1600ms
- NO skeleton flash — page appears complete

**What to say:**

> "This is the goal. Watch the Network tab."
>
> "Phase 1: user, posts, and members — all three start at the same time. Parallel. ~800ms."
>
> "Phase 2: comments starts right after posts finish. It needs the first post's ID, so it has to wait. But there's no render cycle between them — just await to await."
>
> "Total: 1600 milliseconds. And notice — no skeletons. The page appears complete."

**Show the loader code on the page:**

> "Scroll down — the loader code is right there on the page. This is what you'll add."
>
> "Phase 1 uses Promise.all for the parallel fetches. Phase 2 awaits comments after posts resolve. Simple."

### Step 3: Show the Problem (~3 min)

**What to do:**
1. Click **"View Problem →"** button
2. Open the **Network tab**
3. Select a different user to trigger a fresh load

**What to observe:**
- user and members start together (they're siblings)
- posts starts at ~800ms (waits for user — nested component)
- comments starts at ~1600ms (waits for posts)
- Total: ~2400ms
- Visible skeleton flashing as each piece loads

**What to say:**

> "Now look at the problem version. Same page, no loader."
>
> "user and members start together — they're siblings, that's fine."
>
> "But posts waits for user. Why? Look at the component structure: UserPosts is INSIDE UserHeader. It can't mount until user data renders."
>
> "And comments waits for posts — it needs posts[0].id."
>
> "Total: 2400 milliseconds. 800ms slower than the solution. And you see skeletons flashing."

### Step 4: Explain the Task (~2 min)

**What to say:**

> "Your task: open `src/routes/exercise/users.$userId.tsx` and add a loader."
>
> "The file already has a commented-out loader template. You need to:"
>
> "1. Uncomment the import statement at the top"
> "2. Uncomment the loader in the route config"
>
> "That's it. The loader is already written for you — just uncomment and verify it works."
>
> "For extra challenge: delete the comments and write the loader from scratch."

### Step 5: Exercise Time (~10 min)

Let participants work. Walk around and help.

**Common issues:**

1. **"I uncommented but nothing changed"**
   - Did you also uncomment the import at the top of the file?
   - Make sure to import: `userQueryOptions, usersQueryOptions, userPostsQueryOptions, postCommentsQueryOptions`

2. **"I get a TypeScript error"**
   - Check that the import path is `'../../api'`
   - Make sure the import statement is outside any function

3. **"The network still shows waterfall"**
   - Did you save the file?
   - Try clicking a different user to force a fresh navigation
   - Clear the cache with the user selector

**Hints to give:**

> "The loader receives `context` — that's where queryClient lives."
>
> "context.queryClient.ensureQueryData() takes a query options object."
>
> "Phase 1: Promise.all with three ensureQueryData calls."
>
> "Phase 2: if posts.length > 0, await comments using posts[0].id."

### Step 6: Review (~4 min)

**What to do:**
1. Show the completed loader in the problem file
2. Demo that it now works like the solution

**What to say:**

> "Let's review. Here's the loader:"

```tsx
loader: async ({ context, params }) => {
  const userId = parseInt(params.userId, 10)

  // Phase 1: Parallel
  const [user, posts, users] = await Promise.all([
    context.queryClient.ensureQueryData(userQueryOptions(userId)),
    context.queryClient.ensureQueryData(userPostsQueryOptions(userId)),
    context.queryClient.ensureQueryData(usersQueryOptions()),
  ])

  // Phase 2: Dependent
  if (posts.length > 0) {
    await context.queryClient.ensureQueryData(
      postCommentsQueryOptions(posts[0].id)
    )
  }
}
```

> "Phase 1: Everything that CAN be parallel IS parallel. User, posts, members — no dependencies between them."
>
> "Phase 2: Comments NEEDS posts[0].id. That's a real data dependency — you can't parallelize logic. But the loader keeps it tight: await → await, no render cycle."
>
> "Result: 2400ms → 1600ms. One-third faster. No code changes to components. Just added a loader."

---

## Key Teaching Points (~5 minutes)

### Point 1: The Mount-to-Fetch Gap

> "The problem with client-side fetching isn't parallel vs sequential. It's WHEN fetches start."
>
> "Suspense: fetches start at MOUNT time (after JS download, parse, hydration)."
> "Loaders: fetches start at NAVIGATION time (immediately on click)."
>
> "On localhost it's hard to see. In production, it's seconds of difference."

### Point 2: Dependent Fetches Are Tighter

> "When comments depends on posts, both approaches must await. But:"
>
> "Suspense: posts resolves → render → mount → effect → fetch. Frames of work."
> "Loader: await posts → await comments. Microseconds."
>
> "The render cycle between dependent fetches adds up."

### Point 3: Server Loaders Are Even Better

> "This loader runs in the BROWSER. The browser still makes API calls over the internet."
>
> "What if the loader ran on the SERVER? Posts → comments would be two hops on a fast internal network, not two round trips over 4G."
>
> "That's Remix, Next.js RSC, TanStack Start. The next level."

### Point 4: Suspense Is Still Useful

> "Suspense isn't bad — it's great for streaming UI once data is flowing. It's just a bad place to ORIGINATE fetches."
>
> "Use loaders for critical page data. Use Suspense for secondary content that can load progressively. They work together."

---

## Common Questions

**Q: If loaders are better, why use Suspense at all?**
> "Suspense is great for lazy-loaded components, code splitting, and non-critical data that can appear progressively. Loaders handle the critical path. They're complementary."

**Q: We can't see the timing difference on localhost. How do I prove this matters?**
> "Throttle the network in DevTools (Slow 3G). Or deploy to a real server with a real JS bundle. The difference becomes obvious."

**Q: What about the dependent fetch? Both still wait for posts.**
> "True, but the loader eliminates the render cycle between posts resolving and comments starting. And on SSR, both hops are on fast internal network instead of user's connection."

**Q: Why `ensureQueryData` instead of just `fetch`?**
> "ensureQueryData populates the React Query cache. Components use the same cache via useSuspenseQuery. You get prefetching AND React Query's cache management (staleness, background refetch, invalidation)."

**Q: What's `pendingComponent`?**
> "What displays DURING navigation while the loader runs. Instead of in-page skeletons, one navigation-level loading indicator. Then the complete page appears."

**Q: Can we add pendingComponent to the exercise?**
> "Yes! Add `pendingComponent: () => <div>Loading...</div>` to the route config. It shows during the loader."

---

## Time Budget

| Section | Time |
|---------|------|
| Part 1: Demo intro | 3 min |
| Part 1: Suspense tab | 4 min |
| Part 1: Loader tab | 4 min |
| Part 1: Explain timing | 4 min |
| Part 2: Navigate to exercise | 1 min |
| Part 2: Demo solution first | 5 min |
| Part 2: Show problem | 3 min |
| Part 2: Explain task | 2 min |
| Part 2: Exercise time | 10 min |
| Part 2: Review | 4 min |
| Key teaching points | 5 min |
| **Total** | **~45 min** |

---

## Transition to Next Session

**What to say:**

> "We just saw client-side route loaders. Fetches start at navigation, not mount. That's a big win."
>
> "But there's something we haven't addressed: those API calls are still visible in the browser's Network tab. Open DevTools right now — you can see every request, every response."
>
> "What if your API returns sensitive data? Stripe customer IDs, session tokens, internal database IDs? All visible to anyone with DevTools."
>
> "And what about internal APIs that the browser CAN'T reach? Services on a private network?"
>
> "That's where SERVER FUNCTIONS come in. The loader runs on the server, fetches happen server-side, and you control exactly what data reaches the browser."
>
> "Next session: TanStack Start server functions. Same user profile, but with data filtering, internal API access, and aggregation."
