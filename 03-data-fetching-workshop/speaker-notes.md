Perfect. Deep dive into the server era, monorepo with numbered exercises, and a mix of frameworks — this gives us a lot of room to tell the full story properly.

Let me lay out the complete curriculum. I'm going to be thorough here since you want depth.

---

## Session 1: The World Before AJAX (Pre-2005)

**The big idea:** There was no "data fetching" as we know it. The server was the application. The browser was just a display.

**Sub-topics:**

**1.1 — How the web actually worked in the beginning**
- What happens when you type a URL and hit enter — DNS, TCP, HTTP request, server processes, HTML response, browser renders
- The request-response cycle is the *entire* interaction model. Every click, every form submit = full page reload
- The browser is a "dumb terminal" — it just renders what the server sends
- **Takeaway:** The browser had zero responsibility for data. It didn't fetch anything. It received everything.

**1.2 — Server-rendered pages with PHP/JSP**
- How a PHP page works: the server runs your code, queries the database, stitches HTML together, sends it down
- Show a real PHP example — a user profile page that queries MySQL and renders HTML inline
- The `<?php echo $user->name ?>` pattern — data and markup living together
- Why this was actually fine for most websites in 2000-2005
- **Takeaway:** Data fetching happened on the server, before the page even reached the browser. There were no loading spinners. No skeleton screens. The page either showed up complete, or it didn't show up at all.

**1.3 — Forms and the POST-redirect-GET pattern**
- How user input worked: HTML `<form>` with `action` and `method`
- The browser sends a POST, the server processes it, responds with a redirect, browser makes a new GET request, full page reloads
- Why this meant every interaction was slow but predictable
- No client-side validation (or very minimal with inline JS)
- **Takeaway:** "Interactivity" meant the server doing work and sending back a whole new page. The UX was clunky but the mental model was dead simple — the server is always the source of truth.

**1.4 — What was actually good about this model**
- No state synchronization problems — the server always had the latest data
- No caching bugs — every page load was fresh
- SEO worked perfectly — crawlers got the same HTML users did
- Accessibility was straightforward — standard HTML elements, standard behavior
- **Takeaway:** We'll keep coming back to this. A lot of the problems we're solving today in 2025 are problems we *created* by moving away from this model. Understanding what we gave up helps you understand why frameworks are circling back.

**1.5 — What was painful about this model**
- Full page reloads for everything — clicking "like" on a post reloads the entire page
- Server load was high — every tiny interaction is a full roundtrip
- No rich interactivity — no drag and drop, no real-time updates, no smooth transitions
- Gmail and Google Maps in 2004-2005 showed everyone what was possible if the browser could do more
- **Takeaway:** The pain of full page reloads drove the entire next era. Gmail proved that the browser could behave like a desktop app, and everyone wanted that.

**Bridge to next session:** "So the browser was just a display. But Gmail changed everything. How? There was a hidden API in Internet Explorer that nobody expected to become the foundation of modern web apps — `XMLHttpRequest`."

---

## Session 2: The AJAX Revolution (2005-2012)

**The big idea:** We discovered the browser could talk to the server *in the background* without reloading the page. This one capability changed everything about how we build for the web.

**Sub-topics:**

**2.1 — XMLHttpRequest: the accidental API that changed the web**
- Microsoft built it for Outlook Web Access in 1999. It was an ActiveX control.
- Mozilla and others adopted it. It became a de facto standard before it was ever formally standardized.
- Show the raw XHR code — `new XMLHttpRequest()`, `open()`, `onreadystatechange`, `send()`
- Walk through each readyState (0-4) and what they mean
- Why this was mind-blowing: for the first time, JavaScript could request data from a server and update *part* of the page
- **Takeaway:** XHR is ugly and verbose, but it's the ancestor of every `fetch()` call you write today. Understanding it helps you understand what the Fetch API simplified.

**2.2 — The term "AJAX" and what it really meant**
- Jesse James Garrett coined "AJAX" in 2005 — Asynchronous JavaScript and XML
- It wasn't a technology, it was a *pattern*: make a background request, get data back (usually XML, later JSON), update the DOM
- The shift from "server returns HTML" to "server returns data, client renders it"
- This is the first time the browser takes on rendering responsibility
- **Takeaway:** AJAX is a pattern, not a library. The moment we said "the server sends data, the client renders it," we created a whole new category of problems — state management, loading states, error handling — that we're still solving today.

**2.3 — jQuery made AJAX accessible to everyone**
- Raw XHR was painful. jQuery's `$.ajax()`, `$.get()`, `$.post()` made it simple.
- Show a comparison: raw XHR vs jQuery AJAX for the same request
- jQuery handled browser inconsistencies (IE vs Firefox vs Chrome all behaved differently)
- The callback pattern: `success`, `error`, `complete`
- Why jQuery dominated from 2006-2015 — it wasn't just AJAX, it was DOM manipulation, animations, and cross-browser compat all in one
- **Takeaway:** jQuery solved the ergonomics problem. It didn't solve the architecture problem. As apps got bigger, callback-based AJAX code turned into spaghetti.

**2.4 — The callback hell problem**
- Show a realistic example: fetch user → then fetch their posts → then fetch comments on each post
- Nested callbacks 3-4 levels deep — hard to read, hard to debug, hard to handle errors
- Error handling was inconsistent — each callback had its own error path
- This is the first time "data fetching patterns" became a real engineering concern, not just "make a request"
- **Takeaway:** Callbacks work for simple cases. The moment you have dependent data (fetch A, then use A to fetch B), the code becomes unmanageable. This pain directly led to Promises.

**2.5 — Promises and the Fetch API**
- Promises arrived in ES6 (2015) — `.then()` chaining replaced nested callbacks
- The Fetch API replaced XHR with a cleaner, Promise-based interface
- Show the same user → posts → comments example with fetch + .then() chains
- Then show it with async/await — how it reads like synchronous code
- Gotchas: `fetch` doesn't reject on HTTP errors (404/500), you have to check `response.ok`
- **Takeaway:** Promises and fetch cleaned up the syntax, but they didn't change the fundamental challenge — you're still making requests from the client, managing loading/error states manually, and figuring out when and where to fetch.

**2.6 — Was there a waterfall problem in the AJAX era?**
- Yes, but it was less visible. Most jQuery apps were "islands of interactivity" — small AJAX-powered widgets on server-rendered pages, not full SPAs
- The real waterfall problem explodes when the *entire page* is client-rendered and every piece of data is fetched via AJAX
- In the PHP world, waterfalls existed on the server side (sequential DB queries) but were much faster because server-to-database is milliseconds, not browser-to-server which is hundreds of milliseconds
- **Takeaway:** Waterfalls hurt more when the round-trip is slow. Browser-to-server latency made the same sequential pattern 10-100x more painful than server-to-database.

**Bridge to next session:** "AJAX gave us superpowers, but also chaos. Every developer was wiring up their own fetch logic, their own loading states, their own error handling. Then React came along and said 'let's make the UI a function of state.' But it didn't say anything about *how to get that state*. That gap created the era of useEffect + fetch — and all the bugs that came with it."

---

## Session 3: React and the useEffect Era (2013-2020)

**The big idea:** React gave us a brilliant model for rendering UI, but left data fetching as an exercise for the developer. The community converged on `useEffect` + `fetch`, and it was full of footguns.

**Sub-topics:**

**3.1 — Why React won**
- Before React: jQuery spaghetti, Backbone, Angular 1 — all had different models for updating the DOM
- React's insight: UI = f(state). You describe what the UI *should look like* for a given state, and React figures out the DOM updates
- The virtual DOM, component model, one-way data flow
- React *deliberately* didn't include a data fetching solution — it was a "view library," not a framework
- **Takeaway:** React solved the rendering problem beautifully. But by staying silent on data fetching, it created a vacuum. Every team invented their own patterns, and most of them had bugs.

**3.2 — The useEffect + fetch pattern (and why it's broken)**
- Show the canonical pattern: `useState` for data/loading/error, `useEffect` with `fetch` inside
- Walk through what's actually wrong with the most common implementation:
  - No cleanup — what happens when the component unmounts before the fetch completes?
  - Race conditions — what if the user navigates away and back quickly?
  - No caching — every mount refetches, even if we already have the data
  - No deduplication — two components fetching the same data make two requests
  - Stale closures — referencing state from a previous render
- Show the "correct" version with AbortController, cleanup, and error handling — it's 30+ lines for a single fetch
- **Takeaway:** The useEffect + fetch pattern isn't wrong per se, but doing it *correctly* requires handling so many edge cases that it becomes impractical. This is the core pain that React Query was built to solve.

**3.3 — The component-level fetching trap**
- In React, it feels natural to fetch data where you need it — inside the component that renders it
- Show a page with a UserProfile component that fetches user data, and inside it a UserPosts component that fetches posts
- The posts can't start fetching until the profile renders → sequential network requests → this is the waterfall
- The developer didn't *intend* to create a waterfall — the component model *led them to it*
- **Takeaway:** Component-level fetching creates waterfalls by default. You don't see the waterfall in your code because each component only knows about its own fetch. You only see it in the network tab. This is a structural problem, not a skill problem.

**3.4 — Redux and the "global store" approach**
- Redux tried to solve this by centralizing data in a global store
- `dispatch(fetchUser())` → thunk/saga makes the API call → data lands in the store → components read from the store
- Why this helped: caching, shared state, predictable data flow
- Why this was painful: enormous boilerplate, actions/reducers/selectors for every API call, manual cache invalidation, no built-in loading/error states
- The meme: "I wanted to fetch data and now I have 6 new files"
- **Takeaway:** Redux treated server data the same as client state. But they're fundamentally different. Your UI state (is the modal open?) is owned by the client. Your server data (what are the user's posts?) is owned by the server. Mixing them created unnecessary complexity.

**3.5 — The client state vs server state distinction**
- This is the key insight that React Query was built on
- Client state: theme, sidebar open/closed, form input values — the client is the source of truth
- Server state: user profile, list of posts, notifications — the server is the source of truth, the client just has a *cache* of it
- Server state has unique challenges: it can become stale, it can be updated by other users, you need to decide *when* to refetch it
- **Takeaway:** Once you see this distinction, you can never unsee it. React Query, SWR, RTK Query — they all exist because someone realized that server state needs fundamentally different tools than client state.

**Bridge to next session:** "So we had this clear gap — React was great at rendering, but terrible at managing server state. useEffect was too low-level. Redux was too heavy. Then in 2019, Tanner Linsley released React Query and said: 'What if managing server state was just... easy?'"

---

## Session 4: TanStack Query — Server State Done Right (2019-present)

**The big idea:** TanStack Query treats data fetching as a caching and synchronization problem, not a state management problem. This shift in framing makes everything dramatically simpler.

**Sub-topics:**

**4.1 — The mental model: your component is reading from a cache**
- When you call `useQuery`, you're not "fetching data" — you're subscribing to a cache entry
- The cache decides when to fetch: on mount, on window focus, on interval, when invalidated
- Show the simplest useQuery example vs the equivalent useEffect code — the difference in lines of code is dramatic
- The query key is the identity of the cached data — same key in different components = same data, one request
- **Takeaway:** React Query inverts the mental model. You stop thinking "I need to fetch this data" and start thinking "I need this data to be available." The library handles the when and how.

**4.2 — What React Query gives you for free**
- Automatic caching and deduplication — mount the same component 5 times, get 1 request
- Background refetching — data stays fresh without loading spinners
- Stale-while-revalidate — show cached data immediately, refetch in background
- Automatic retry with exponential backoff
- Window focus refetching — user tabs back, data refreshes
- Garbage collection — unused cache entries are cleaned up
- Show each of these in action with DevTools open — this is where the "wow" moment happens
- **Takeaway:** Every one of these features is something you'd have to build manually with useEffect. React Query isn't magic — it's all the edge cases handled correctly in one place.

**4.3 — Mutations and cache invalidation**
- `useMutation` for creating/updating/deleting data
- The `onSuccess → invalidateQueries` pattern — after mutation, mark relevant cached data as stale so it refetches
- Optimistic updates — update the UI immediately, roll back if the mutation fails
- Show a real example: adding a todo, the list updates instantly, reverts if the server returns an error
- **Takeaway:** The hardest part of client-side data management is keeping the cache consistent after writes. React Query makes this explicit and manageable through invalidation and optimistic updates.

**4.4 — Dependent queries and the parallel fetching pattern**
- `enabled` option — fetch B only after A succeeds: `useQuery({ enabled: !!userId })`
- Parallel queries with `useQueries` — fetch multiple unrelated things at once
- Show the waterfall example from Session 3 rewritten with React Query — the code is cleaner, but...
- ...if the queries are truly dependent (need user ID to fetch posts), React Query *still waterfalls*
- **Takeaway:** React Query makes waterfalls more manageable and eliminates unnecessary ones (via caching and deduplication), but it can't fix structural waterfalls caused by component hierarchy. If component B is nested inside component A, and B's query depends on A's data, the waterfall is inherent in the component tree.

**4.5 — Where React Query can't help**
- The initial page load — the very first time a user hits your app, there's nothing in the cache
- Structural waterfalls — component tree determines fetch order, React Query can't change that
- Server-side rendering — React Query works with SSR (prefetching on server, hydrating on client) but it's extra setup
- These aren't flaws in React Query — they're limitations of the client-side fetching model itself
- **Takeaway:** React Query is the best solution for client-side data fetching. But some problems can't be solved on the client at all. This is why the conversation shifted toward fetching data *before* components render.

**Bridge to next session:** "React Query solved the caching problem. But there's still the waterfall problem on initial load. What if the browser didn't have to discover which data it needs by rendering components? What if someone told it upfront? That's the idea behind React Suspense — but it's a stepping stone, not the final answer."

---

## Session 5: React Suspense for Data Fetching

**The big idea:** Suspense lets components declare "I need data" without specifying *when* or *how* to fetch it. It separates the *what* from the *when*, opening the door for frameworks to optimize the *when*.

**Sub-topics:**

**5.1 — Suspense for code splitting (the original use case)**
- `React.lazy()` + `<Suspense fallback={...}>` — this shipped in React 16.6 (2018)
- Suspense was originally about lazy-loading components, not data
- Show a basic code-split route — the loading fallback appears while the chunk downloads
- This established the pattern: a component can "suspend" (say "I'm not ready yet"), and the nearest Suspense boundary shows a fallback
- **Takeaway:** Suspense introduced the concept of declarative loading states. Instead of `if (loading) return <Spinner />` in every component, you put one `<Suspense>` boundary and it handles all suspensions beneath it.

**5.2 — Suspense for data fetching: the concept**
- What if a data fetch could also "suspend" a component?
- The pattern: your fetch function throws a Promise while loading. React catches it, shows the Suspense fallback, and re-renders when the Promise resolves.
- This is weird if you're used to try/catch — you're *throwing a Promise*, not an Error
- Show the mental model: render → component tries to read data → data isn't ready → throw promise → Suspense catches → shows fallback → data arrives → re-render → component reads data successfully
- **Takeaway:** Suspense makes loading states architectural instead of per-component. You define loading boundaries in your component tree, and any fetch beneath a boundary automatically uses that boundary's fallback.

**5.3 — How React Query integrates with Suspense**
- `useSuspenseQuery` — same as `useQuery` but suspends instead of returning `isLoading`
- The component code gets simpler: no more checking `isLoading` or `isError` — the data is always available when the component renders
- Error boundaries handle errors, Suspense boundaries handle loading
- Show before/after: a component with useQuery (checking isLoading, isError, data) vs useSuspenseQuery (just uses data directly)
- **Takeaway:** Suspense + React Query gives you cleaner component code. But it doesn't solve the waterfall — if component B is inside component A, B still can't start fetching until A finishes, because B doesn't render until A unsuspends.

**5.4 — The waterfall problem remains (with a demo)**
- Build a concrete example: Profile page with user info, then user's posts, then each post's comment count
- Show it with useSuspenseQuery — the network tab clearly shows fetch 1 → wait → fetch 2 → wait → fetch 3
- Each Suspense boundary waits for its own data before rendering children
- Multiple Suspense boundaries can help *parallelize* sibling components, but parent-child waterfalls persist
- **Takeaway:** Suspense gives us better DX and better loading UX, but the fundamental problem is the same — the browser discovers data requirements by rendering the component tree, which is inherently sequential for nested components.

**5.5 — What would actually fix the waterfall?**
- Thought experiment: what if we could know *all* the data a page needs *before* rendering any components?
- On the server, this is trivial — PHP did it! The server knows the full page, fetches everything, sends it down.
- On the client with SPAs, the only thing that "knows" the full page before rendering is... the router. The route URL tells you what page you're on, and from that you can derive what data you need.
- This is the key insight: **tie data fetching to routes, not components**
- **Takeaway:** The waterfall exists because components discover data needs during render. If we move data fetching to the route level — before components render — we can fetch everything in parallel. This is the idea behind route loaders.

**Bridge to next session:** "So the router is the only thing that knows what page we're loading before React even starts rendering. What if the router could also kick off data fetches? That's exactly what Remix, React Router, Next.js, and TanStack Router all implemented — and it brings us full circle to the server-rendered model, just smarter."

---

## Session 6: Route Loaders and the Return to the Server

**The big idea:** The latest generation of React frameworks moved data fetching to the route level — before components render. This eliminates waterfalls on navigation and, in many cases, moves the fetching back to the server. We've come full circle from PHP, but with client-side interactivity intact.

**Sub-topics:**

**6.1 — The loader concept**
- A loader is a function that runs *before* a route's component renders
- It receives the route params (URL params, search params) and returns the data the component needs
- The router calls all loaders for matched routes *in parallel* — no waterfall
- Show the concept in pseudocode first, framework-agnostic
- **Takeaway:** Loaders invert the relationship between rendering and fetching. Instead of "render component → discover data needs → fetch," it's "match route → fetch all data → render component with data already available."

**6.2 — React Router loaders (v6.4+)**
- React Router added loaders directly inspired by Remix
- Show a `createBrowserRouter` setup with loaders on route definitions
- The `useLoaderData()` hook — no loading states needed, data is guaranteed available
- Parallel loading: parent and child route loaders run simultaneously
- `defer` for optional streaming — return a Promise from the loader, Suspense handles the loading state while critical data loads immediately
- **Takeaway:** React Router brought the loader pattern to pure client-side apps. You don't need a server to benefit from route-level fetching — the browser can start fetching as soon as a link is clicked, before navigation completes.

**6.3 — Remix and the server-first model**
- Remix took the loader concept further — loaders run *on the server* by default
- The server loader fetches data, and Remix sends it to the client alongside the HTML
- `action` functions handle mutations (forms), just like the POST-redirect-GET pattern from Session 1
- Show how a Remix route with loader + action looks remarkably similar to PHP — data fetching and form handling on the server, but with a React component for the UI
- **Takeaway:** Remix is philosophically a return to the server-rendered model, but with the DX of React components. The data fetching is on the server (fast, close to the database), the rendering is hybrid (server HTML + client hydration), and the interactivity is React.

**6.4 — Next.js App Router and Server Components**
- Server Components (RSC) are the React team's answer — components that *only* run on the server
- In Next.js App Router, components are server components by default — they can directly `await` data
- Show a server component that fetches data: it looks like the PHP example from Session 1, but it's a React component with JSX
- `'use client'` boundary — below this, you're back to client components with hooks
- How this interplays with Suspense and streaming
- **Takeaway:** Server Components are the most radical version of the "move fetching back to the server" idea. The component itself runs on the server, so there's no client-side fetch at all for server components. The waterfall problem doesn't exist because server-to-database is fast.

**6.5 — TanStack Router and type-safe loaders**
- TanStack Router takes the loader pattern with full type safety — the loader's return type flows into the component's props
- `beforeLoad` for authentication/guards, `loader` for data
- Built-in integration with TanStack Query — use `queryClient.ensureQueryData()` in the loader to prefetch, then `useQuery` in the component reads from cache
- Show how this combines the best of both: route-level prefetching eliminates waterfalls, React Query manages the cache and background updates
- Search params as first-class state — validated, typed, serialized
- **Takeaway:** TanStack Router shows that you don't have to choose between loaders and React Query. The loader prefetches (eliminates waterfall), and React Query manages the cache (handles staleness, refetching, mutations). They complement each other.

**6.6 — The full circle moment**
- Show a side-by-side comparison:
  - 2003 PHP: Server fetches data → renders HTML → sends to browser
  - 2012 jQuery: Browser loads page → makes AJAX calls → updates DOM
  - 2018 React: Browser loads bundle → renders components → each component fetches its own data
  - 2024 Remix/Next: Server fetches data → renders HTML (with React) → sends to browser → client hydrates for interactivity
- We went from "server does everything" to "client does everything" and back to "server does the data, client does the interactivity"
- The difference from PHP: we now have client-side navigation, optimistic updates, streaming, partial hydration, and rich interactivity *after* the initial load
- **Takeaway:** The web platform evolves in spirals, not lines. We keep revisiting the same ideas — server rendering, route-level data, progressive enhancement — but with new capabilities each time. Understanding the full history helps you make better architectural decisions because you understand *why* each approach exists and what it's trading off.

---

## Session 7: Putting It All Together (Workshop / Hands-on)

**The big idea:** Now that we understand the full evolution, let's build the same feature using every approach — and see the trade-offs firsthand.

**Sub-topics:**

**7.1 — The exercise: a user profile page**
- Same feature across all paradigms: show a user's profile, their recent posts, and a follow/unfollow button
- Each exercise has a "problem" version (incomplete or buggy) and a "solution" version
- Participants run each version, observe the behavior, then fix the problem version

**7.2 — Exercise stations**
- Station 1: useEffect + fetch (spot the bugs: no cleanup, race condition, no error handling)
- Station 2: React Query (convert the useEffect version to useQuery, add mutation for follow/unfollow)
- Station 3: Waterfall diagnosis (open DevTools, identify the waterfall, parallelize with useQueries)
- Station 4: Suspense migration (convert useQuery to useSuspenseQuery, add Suspense boundaries, add ErrorBoundary)
- Station 5: Route loader (move fetching to a loader, use useLoaderData, observe no waterfall in network tab)
- Station 6: TanStack Router + Query integration (loader prefetches with ensureQueryData, component uses useQuery)

**7.3 — Group discussion**
- Which approach felt simplest?
- Which would you choose for a new project at Suki?
- When would you pick React Query alone vs loaders + React Query?
- What changes if your app is real-time (WebSockets)?

**Takeaway for the entire workshop:** There's no single "best" approach. Each era solved real problems and introduced new ones. The skill is understanding the trade-offs and picking the right approach for your specific situation.

---

That's the full curriculum across 7 sessions. A few notes on the overall structure:

Each session builds on the previous one — the problems of one era motivate the solutions of the next. The last session ties everything together with hands-on exercises.

For the monorepo, I'm thinking a structure like `exercises/01-xhr-basics/problem.ts` and `exercises/01-xhr-basics/solution.ts` with a shared mock API server and a test runner that validates solutions. We can flesh that out once the content is locked.

What do you think? Anything you want to add, cut, reorder, or go deeper on?
