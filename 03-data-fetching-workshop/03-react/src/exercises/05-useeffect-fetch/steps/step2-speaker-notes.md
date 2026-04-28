# Step 2: Loading State — Speaker Notes

## Time: 5 minutes

## Setup

- Browser at http://localhost:5173/05/step-2
- Editor open to `Step2.tsx`

---

## Script

### Opening (30 seconds)

> "In Step 1, what did users see while waiting for data? 'No data yet...' — that's confusing. Is it loading? Is it broken? Users don't know."
>
> "We need to show a loading state. This is the second piece of the data fetching puzzle."

### The Task (30 seconds)

> "Add a loading state to this component:
> 1. Create `isLoading` state, initialized as `true`
> 2. Set it to `false` when the fetch completes
> 3. Show the `<Skeleton />` component while loading"

### Let Them Work (2-3 minutes)

Quick task — most will finish fast.

**"Should I set loading to true before fetching?"**
> "It's already true from the initial state. But if you add a refresh button later, you'd set it to true at the start of each fetch."

**"What's the Skeleton component?"**
> "It's already imported — just render `<Skeleton count={1} height={100} />` when loading"

### Review (1 minute)

```tsx
const [user, setUser] = useState<User | null>(null);
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  async function loadUser() {
    setIsLoading(true);
    const response = await fetch(...);
    const data = await response.json();
    setUser(data.data);
    setIsLoading(false);
  }
  loadUser();
}, []);

if (isLoading) return <Skeleton count={1} height={100} />;
```

> "Notice the order of our checks:
> 1. If loading, show skeleton
> 2. If no user (and not loading), return null
> 3. Otherwise, show the user card"

### Quick Experiment

> "Try changing `useState(true)` to `useState(false)`. What happens?"

Answer: Brief flash of "No data yet" before the skeleton appears — bad UX.

### Transition

> "Good, we have loading. But what if the API returns an error? Let's handle that in Step 3."

---

## Key Concepts

1. **Loading is separate from data** — you need both states
2. **Initialize loading as true** — we start loading immediately
3. **Check loading first** — the order of conditionals matters

## Watch For

- Forgetting to set loading false in all code paths
- Checking `!user` before checking `isLoading`
