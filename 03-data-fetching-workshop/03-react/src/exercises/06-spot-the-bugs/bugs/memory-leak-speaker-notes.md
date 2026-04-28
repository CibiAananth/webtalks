# Bug #2: Memory Leak — Speaker Notes

## Time: 5 minutes

## The Bug

Unmounting a component mid-fetch doesn't cancel the request. The request completes, tries to setState on an unmounted component.

---

## Script

### Setup

> "This bug is about what happens when components disappear mid-request. We have a 3-second delay to give you time to unmount."

### Demo

1. Click "Mount" on the Buggy side
2. While loading (3 seconds), click "Unmount"
3. Watch the Network Log — the request still completes!

### Explanation

> "The component is gone, but the fetch doesn't know that. It's a closure over the component's setState. When the response arrives, it tries to update state that no longer exists."
>
> "In older React versions, you'd see a warning: 'Can't perform a React state update on an unmounted component.'"

### Real-World Impact

> "This happens all the time:
> - User clicks a link, starts loading a page, then clicks Back
> - User opens a modal, it fetches data, user closes it quickly
> - Tabs that unmount when switching
>
> Every one of these can trigger this bug."

### Wasted Resources

> "Even if React handles the setState gracefully, you've wasted:
> - Network bandwidth
> - Server resources
> - Battery on mobile devices
>
> Multiply by thousands of users doing this constantly."

### The Fix

Same solution — AbortController in cleanup:

```tsx
useEffect(() => {
  const controller = new AbortController();

  fetch(url, { signal: controller.signal })
    .then(/* ... */)
    .catch(err => {
      if (err.name !== 'AbortError') console.error(err);
    });

  return () => controller.abort(); // Runs on unmount!
}, []);
```

> "The cleanup function runs when the component unmounts. We abort the request. Server might still process it, but we're not waiting for the response."

### Try It

> "Now try on the Fixed side. Mount, then Unmount. Check the Network Log — you'll see the request started but no 200 response (or an aborted status)."

---

## Discussion

> "Notice how the fix for Bug #1 (race condition) and Bug #2 (memory leak) is the same: AbortController in cleanup. Two bugs, one solution."
>
> "But you have to remember to add this to every useEffect that fetches. React Query does this automatically."
