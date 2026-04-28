# Exercise 05: useEffect + fetch — Speaker Notes

## Overview

**Time estimate:** 25-30 minutes total

**Goal:** Participants build the classic useEffect + fetch pattern step by step, understanding each piece before moving to the next.

**Key teaching moment:** By Step 4, they should realize how much boilerplate is required for "correct" data fetching — and that it still has hidden problems.

---

## Step 1: Fetch & Render (5-7 minutes)

### What to say

> "Welcome to React! We're leaving the callback and Promise world behind and entering the component world. But here's the thing — React components are synchronous. They render, return JSX, done. So how do we fetch data?"
>
> "The answer is useEffect. It lets us run side effects — like fetching — after the component renders."

### What to ask participants

1. "Open `src/exercises/05-useeffect-fetch/steps/Step1.tsx` in your editor"
2. "Find the `UserProfileProblem` component"
3. "Your task: make it fetch user data from the API and display it"
4. "Hint: you need `useState` for the data and `useEffect` to trigger the fetch"

### Key points to emphasize

- **You can't make useEffect's callback async directly** — define an async function inside and call it
- The empty dependency array `[]` means "run once on mount"
- The API returns `{ data: User }` — don't forget to unwrap it

### Common mistakes to watch for

- Making the useEffect callback itself async: `useEffect(async () => ...)` — this returns a Promise, not a cleanup function
- Forgetting the dependency array (causes infinite loop in Strict Mode)
- Not unwrapping `data.data`

### When to reveal solution

After 3-4 minutes, or when most participants have something rendering. Show the solution and highlight:
- The async function pattern inside useEffect
- The empty dependency array

---

## Step 2: Loading State (5 minutes)

### What to say

> "Great, we can fetch data. But what did you see before the data arrived? 'No data yet' — that's a terrible user experience. Let's fix it with a loading state."

### What to ask participants

1. "Open `Step2.tsx`"
2. "Add an `isLoading` state that starts as `true`"
3. "Set it to `false` when the fetch completes"
4. "Show the `<Skeleton />` component while loading"

### Key points to emphasize

- Loading state is **separate** from data state — you need both
- Initialize `isLoading` as `true` because we start loading immediately
- The skeleton gives users visual feedback that something is happening

### Discussion question

> "What happens if we initialize `isLoading` as `false`? Try it and see."

Answer: Users see "No data yet" briefly before the skeleton, which is jarring.

---

## Step 3: Error Handling (7-8 minutes)

### What to say

> "What if the API returns a 404? What if the server is down? Right now, our component would either show nothing or crash. Let's handle errors properly."

### What to ask participants

1. "Open `Step3.tsx`"
2. "Add an `error` state"
3. "Wrap the fetch in try/catch"
4. "**Important:** Check `response.ok` — fetch doesn't throw on 404!"
5. "Use the user ID buttons to test — try user 999"

### Key points to emphasize

- **fetch() does NOT throw on HTTP errors** — this is a common gotcha
- You must check `response.ok` and throw manually
- The retry button should re-trigger the fetch

### Live demo

Click through users 1-5, then click 999:
> "See? 404, but our component handles it gracefully with an error message and retry button."

### Common mistakes

- Assuming fetch throws on 404 — it doesn't!
- Forgetting to reset error state on retry
- Not clearing user state when switching to a new user

---

## Step 4: The Complete Pattern (5 minutes)

### What to say

> "This is the 'correct' useEffect + fetch pattern. Loading, errors, cleanup, re-fetch on prop change. Take a moment to count the lines of code."
>
> "About 40 lines for a **single fetch**. And here's the thing — it still has bugs you can't see in this isolated demo."

### What to show

- Walk through the complete code
- Point out the `cancelled` flag for cleanup
- Show how it re-fetches when `userId` changes

### Questions to plant

Read the bullet points in the insight box aloud:

> "What happens if you click between users really fast? What if you unmount mid-fetch? What if three components need this same user? What if you navigate away and come back?"

### Transition to Exercise 06

> "These aren't rhetorical questions. Let's go see each of these bugs in action. Head to Exercise 06."

---

## Wrap-up Points

Before moving on, make sure participants understand:

1. useEffect is how we do side effects in React
2. Data fetching requires managing THREE states: data, loading, error
3. fetch() doesn't throw on HTTP errors
4. The "correct" pattern is verbose — and still has problems
5. This is why libraries like React Query exist

---

## Troubleshooting

### "The API isn't responding"

Make sure the API server is running: `npm run api` from the workshop root

### "I'm getting a CORS error"

The API server should have CORS enabled. Check that you're fetching from `http://localhost:3069/api/...`

### "My component re-renders infinitely"

They probably forgot the dependency array on useEffect, or they're creating a new object/function in the dependency array each render.
