# Step 3: Error Handling — Speaker Notes

## Time: 7-8 minutes

## Setup

- Browser at http://localhost:5173/05/step-3
- Editor open to `Step3.tsx`

---

## Script

### Opening (1 minute)

> "What happens if the server is down? Or the user doesn't exist? Right now our component would either show nothing forever or crash."
>
> "Error handling is the third piece of the data fetching puzzle. And there's a gotcha that trips up almost everyone..."

### The Gotcha (Important!)

> "Here's the thing about `fetch()`: **it does NOT throw on HTTP errors**. A 404 response? A 500? Fetch considers those successful — it got a response."
>
> "You have to check `response.ok` yourself and throw manually. This is different from axios or other libraries that throw on non-2xx responses."

### The Task (30 seconds)

> "Add error handling:
> 1. Create an `error` state
> 2. Wrap the fetch in try/catch
> 3. Check `response.ok` — if false, throw an error
> 4. Show the `<ErrorMessage />` component on error, with a retry callback
>
> Test it by clicking user 999 — that returns a 404."

### Let Them Work (4-5 minutes)

This one takes longer. Help with:

**"How do I check response.ok?"**
```tsx
if (!response.ok) {
  throw new Error(`Failed: ${response.status}`);
}
```

**"How do I make the retry button work?"**
> "Extract the fetch logic into a named function, then pass it to `onRetry`"

**"Should I reset the error when retrying?"**
> "Yes! Set error to null at the start of each fetch attempt"

### Review (2 minutes)

Walk through the solution:

```tsx
const [error, setError] = useState<string | null>(null);

function loadUser() {
  setIsLoading(true);
  setError(null);
  setUser(null);

  fetch(API_BASE + "/users/" + userId + "?delay=800")
    .then(response => {
      if (!response.ok) throw new Error(`User not found (${response.status})`);
      return response.json();
    })
    .then(data => setUser(data.data))
    .catch(err => setError(err.message))
    .finally(() => setIsLoading(false));
}

useEffect(() => {
  loadUser();
}, [userId]);

if (isLoading) return <Skeleton />;
if (error) return <ErrorMessage message={error} onRetry={loadUser} />;
```

### Live Demo

1. Click through users 1-5 — all work
2. Click user 999 — shows error
3. Click Retry — fetches again (still 404)
4. Click user 1 — recovers gracefully

> "Notice how we clear the error when switching users or retrying. State management gets tricky."

### Transition

> "We now have loading, data, and error handling. Step 4 shows the complete pattern with one more piece: cleanup."

---

## Key Concepts

1. **fetch() doesn't throw on HTTP errors** — you must check `response.ok`
2. **Three states: loading, data, error** — manage all three
3. **Reset state on retry/change** — clear error and data when starting fresh
4. **Extract fetch logic** — makes retry possible

## Watch For

- Assuming fetch throws on 404
- Forgetting to reset error state
- Not clearing previous user data when switching users
- Using async/await without try/catch (promise chain with .catch is fine too)
