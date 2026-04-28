# Step 1: Fetch & Render — Speaker Notes

## Time: 5-7 minutes

## Setup

Make sure participants have:
- The React dev server running (`npm run dev` in 03-react/)
- The API server running (`npm run api` from workshop root)
- Browser open to http://localhost:5173/05/step-1
- Editor open to `src/exercises/05-useeffect-fetch/steps/Step1.tsx`

---

## Script

### Opening (1 minute)

> "We're now in React land. The fundamental challenge: React components are synchronous — they render and return JSX immediately. But data fetching is asynchronous. How do we bridge that gap?"
>
> "The answer is `useEffect`. It's React's escape hatch for side effects — things that happen outside the normal render cycle, like API calls, subscriptions, or DOM manipulation."

### The Task (30 seconds)

> "Your task is simple: make this component fetch a user from the API and display it."
>
> "Look at the TODO comments in the code. You need:
> 1. State to hold the user data
> 2. A useEffect to fetch when the component mounts
> 3. Render the user with the UserCard component"

### Let Them Work (3-4 minutes)

Walk around, help stuck participants. Common issues:

**"How do I make useEffect async?"**
> "You can't make the callback itself async. Define an async function *inside* the useEffect and call it."

**"What URL do I fetch?"**
> "Check the constant at the top: `API_BASE + '/users/1?delay=800'`"

**"Why isn't my data showing?"**
> "The API returns `{ data: User }`. Did you unwrap `data.data`?"

### Review (1-2 minutes)

Click "Show Solution" and walk through:

```tsx
const [user, setUser] = useState<User | null>(null);

useEffect(() => {
  async function loadUser() {
    const response = await fetch(API_BASE + "/users/1?delay=800");
    const data = await response.json();
    setUser(data.data);
  }
  loadUser();
}, []);
```

> "Key points:
> - We define `loadUser` as async *inside* useEffect, then call it
> - The empty array `[]` means 'run once on mount'
> - We unwrap `data.data` because the API wraps the response"

### Transition

> "Great, we can fetch data. But watch what happens before the data arrives... 'No data yet.' That's not a great user experience. Let's fix that in Step 2."

---

## Key Concepts to Reinforce

1. **useEffect runs after render** — the component renders first with null data, then useEffect fires
2. **The dependency array controls when it re-runs** — empty = mount only
3. **Async functions inside, not as the callback** — useEffect callbacks must be synchronous or return a cleanup function

## Watch For

- Participants making useEffect callback async directly
- Missing dependency array (causes double-fetch in Strict Mode)
- Confusion about the `{ data: User }` wrapper
