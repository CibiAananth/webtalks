# Session 06: Server Loaders — Speaker Notes

## Learning Objectives
- Understand that **client loaders still expose API calls** in the browser's Network tab
- Learn when to use **server functions** for sensitive operations
- See how server functions enable: API secrets, internal APIs, data filtering, aggregation
- Recognize the tradeoffs between SSR with React Query vs full server functions

## Prerequisites
- Participants have completed Session 05 (Route Loaders)
- They understand loaders run at navigation time, not mount time
- They know how `ensureQueryData` bridges loaders and React Query

## Setup
```bash
# Terminal 1: API server (from project root)
node shared/api-server.js

# Terminal 2: This exercise
cd 06-server-loaders
pnpm install
pnpm dev
```

Open http://localhost:3000/demo

---

## The Problem — Client Loaders Still Expose Data

**Use this if participants ask "why do we need server functions if we have loaders?"**

### Client Loaders Are Still Client-Side

In Session 05, we moved fetch-start from mount time to navigation time. But those fetches still happen in the **browser**:

```
[ click link ][ browser fetches /api/users/1 ][ render with data ]
                        ↑ visible in Network tab
                        ↑ sensitive data sent to browser
```

The API response is fully visible in DevTools. If your API returns sensitive fields (tokens, internal IDs, PII), they're exposed to the client.

### What Server Functions Change

```
[ click link ][ browser calls /_server/* ][ server fetches APIs ][ filtered data returned ]
                                                    ↑ NOT visible in browser
                                                    ↑ sensitive data stays on server
```

The browser only sees `/_server/*` calls. The actual API calls happen on your server. You control exactly what data reaches the client.

---

## Part 1: Demo (~20 minutes)

### Introduction (~3 min)

**What to say:**

> "Last session we moved fetches from mount time to navigation time using loaders. Big improvement."
>
> "But here's a question: where do those fetches actually run? Let's find out."

Navigate to http://localhost:3000/demo/profile

### SSR with React Query Tab (~7 min)

**What to do:**
1. Click "SSR (with React Query)" tab (should be default)
2. Open the browser's **Network tab** (DevTools → Network)
3. Click "Hard Reload" to clear cache
4. Switch between users

**What to observe:**
- Network tab shows: `localhost:3069/api/users/1`, `localhost:3069/api/users/1/posts`
- Click on the `/api/users/1` request
- Look at the Response tab — you'll see ALL fields including sensitive ones

**What to say:**

> "Look at the Network tab. You can see the actual API calls to localhost:3069."
>
> "Click on the users request. Look at the Response."
>
> "See these fields? stripeCustomerId, lastLoginIp, sessionToken, internalDatabaseId."
>
> "This is a problem. The API returns everything, and the browser sees everything."

**Let participants discover:**

> "Take 30 seconds. Look at the response. What shouldn't be there?"

Wait for them to spot: `stripeCustomerId`, `lastLoginIp`, `sessionToken`, `internalDatabaseId`

**What to say:**

> "These are real security concerns:"
> - "stripeCustomerId — payment info leaking"
> - "lastLoginIp — privacy violation"
> - "sessionToken — session hijacking risk"
> - "internalDatabaseId — internal architecture exposed"
>
> "The API is designed for internal use. The browser shouldn't see this."

### Server Functions Tab (~7 min)

**What to do:**
1. Click "Server Functions" tab
2. Keep the Network tab open
3. Switch between users

**What to observe:**
- Network tab shows: `/_server/*` calls ONLY
- NO `localhost:3069` calls visible
- Click on the `/_server/*` request — response is filtered
- Additional data: Activity Stats (aggregated from internal API)

**What to say:**

> "Now look at the Network tab. What's different?"
>
> "No localhost:3069 calls. Just `/_server/*`."
>
> "The API calls happen on the SERVER. The browser only sees the server function call."

**Click on the /_server/* response:**

> "Look at the response. What's missing?"
>
> "No stripeCustomerId. No sessionToken. No lastLoginIp. No internalDatabaseId."
>
> "The server function filtered the data BEFORE sending to the client."

**Point out the Activity Stats:**

> "And notice — we have Activity Stats here. Total Logins, Documents, API Calls."
>
> "Where did this come from? An internal `/api/users/:id/stats` endpoint."
>
> "In a real app, this might be on a private network the browser can't reach. But the server can."

### Explain the Four Benefits (~3 min)

**What to say:**

> "Server functions solve four problems:"
>
> "1. API SECRETS — That `INTERNAL_API_KEY` in the code? It stays on the server. Never sent to the browser."
>
> "2. INTERNAL APIs — The stats endpoint might be on a private network. Browser can't reach it, server can."
>
> "3. DATA FILTERING — We explicitly pick which fields to return. Sensitive data never leaves the server."
>
> "4. AGGREGATION — Three API calls (user, stats, posts) become ONE server function call. Browser makes 1 request, server makes 3."

---

## Part 2: Code Walkthrough (~15 minutes)

### Show the Server Function Code

Open `src/routes/demo/server-fn.tsx`

**What to say:**

> "Let's look at how this works."

```tsx
const getSecureUserWithStats = createServerFn().handler(async (ctx) => {
  const userId = ctx.data as number

  // 1. AGGREGATION - Three parallel fetches
  const [userRes, statsRes, postsRes] = await Promise.all([
    fetch(`${API_BASE}/users/${userId}?delay=300`),
    fetch(`${API_BASE}/users/${userId}/stats?delay=300`),
    fetch(`${API_BASE}/users/${userId}/posts?delay=300`),
  ])

  // ... parse responses ...

  // 3. DATA FILTERING - Only return safe fields
  const secureUser = {
    id: rawUser.id,
    name: rawUser.name,
    email: rawUser.email,
    role: rawUser.role,
    avatar: rawUser.avatar,
    joined: rawUser.joined,
    stats: stats,
    posts: posts,
    // NOT INCLUDED: stripeCustomerId, lastLoginIp, sessionToken, internalDatabaseId
  }

  return secureUser
})
```

> "createServerFn() — this function ONLY runs on the server. The code is never sent to the browser."
>
> "Promise.all — three API calls in parallel. Aggregation."
>
> "The return object — we explicitly list safe fields. Filtering."

### Show the Loader

```tsx
loader: async ({ deps }) => {
  const userId = deps.userId ?? 1
  return getSecureUserWithStats({ data: userId })
}
```

> "The loader calls the server function. Simple."
>
> "loaderDeps tells TanStack Router to re-run when userId changes."

### Compare with SSR + React Query

Open `src/routes/demo/profile.tsx`

```tsx
loader: async ({ context, location }) => {
  const userId = (location.search as ProfileSearch).userId ?? 1

  const [user, posts] = await Promise.all([
    context.queryClient.ensureQueryData(userQueryOptions(userId)),
    context.queryClient.ensureQueryData(userPostsQueryOptions(userId)),
  ])

  return { user, posts }
}
```

> "This loader also uses ensureQueryData. But the fetches happen in the browser."
>
> "The data flows: Browser → API → Browser. Everything is visible in Network tab."
>
> "With server functions: Browser → Server → API → Server → Browser. The API call is hidden."

---

## Key Teaching Points (~5 minutes)

### Point 1: When to Use Server Functions

> "Not everything needs a server function. Use them when:"
>
> "1. You have API secrets (tokens, keys) that must stay on server"
> "2. You're calling internal APIs the browser can't reach"
> "3. The API returns data that shouldn't go to the client"
> "4. You want to aggregate multiple calls into one"
>
> "For public APIs with no sensitive data? SSR with React Query is fine."

### Point 2: Server Functions vs API Routes

> "You might ask: why not just make a backend route?"
>
> "Server functions ARE backend routes — auto-generated. You write a function, TanStack Start creates the `/_server/*` endpoint."
>
> "But they're colocated with your component. You see the data shape right next to where it's used."

### Point 3: The Tradeoff

> "Server functions add a hop. Browser → Server → API instead of Browser → API."
>
> "But the server is usually closer to the API (same datacenter, internal network). And you gain security and control."

---

## Common Questions

**Q: Why not just fix the API to not return sensitive fields?**
> "In a perfect world, yes. But often:"
> - "The API serves multiple clients (mobile, internal tools) that need different fields"
> - "You don't control the API (third-party service)"
> - "Changing the API requires backend team coordination"
>
> "Server functions let the frontend team control what reaches the browser."

**Q: Is this just a BFF (Backend For Frontend)?**
> "Conceptually, yes. But without managing a separate service. The server function IS your BFF, colocated with your components."

**Q: What about caching?**
> "Server functions can use React Query on the server side too. Or you can add caching headers. TanStack Start handles the details."

**Q: What if the server function is slow?**
> "Same as any API. Use pendingComponent to show a loading state during navigation. The user sees a spinner instead of a blank screen."

**Q: Can I use server functions for mutations?**
> "Yes! createServerFn works for POST/PUT/DELETE too. Great for forms that need to call secure APIs."

---

## Time Budget

| Section | Time |
|---------|------|
| Part 1: Introduction | 3 min |
| Part 1: SSR tab demo | 7 min |
| Part 1: Server Functions tab demo | 7 min |
| Part 1: Four benefits | 3 min |
| Part 2: Server function code | 7 min |
| Part 2: Compare approaches | 8 min |
| Key teaching points | 5 min |
| **Total** | **~40 min** |

---

## Demo Script — Quick Reference

### Tab 1: SSR with React Query
1. Open Network tab
2. Hard Reload
3. Click on `/api/users/1` request
4. Show Response — sensitive fields visible
5. **Key question:** "What shouldn't be in this response?"

### Tab 2: Server Functions
1. Switch tabs
2. Show Network tab — only `/_server/*` calls
3. Click on `/_server/*` response — filtered data
4. Point out Activity Stats — from internal API
5. **Key point:** "Three API calls, one browser request. Data filtered."

---

## Wrap-Up

**What to say:**

> "We've now seen the full picture:"
>
> "Session 05: Move fetch-start from mount to navigation (client loaders)"
> "Session 06: Move fetches from browser to server (server functions)"
>
> "Use client loaders for public data. Use server functions when you need security, internal APIs, or data control."
>
> "The same pattern applies to Remix, Next.js RSC, and other SSR frameworks. The concepts transfer."
