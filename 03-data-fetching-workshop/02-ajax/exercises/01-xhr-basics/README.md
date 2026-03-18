# Exercise 01: XMLHttpRequest — The Foundation of AJAX

## Context

The year is 2006. You're building a team directory page. Until now, every time a
user wanted to see the team list, the **entire page** had to reload (like the PHP
demo from Session 1).

Your tech lead just showed you something called `XMLHttpRequest`. It can fetch
data from the server **without reloading the page**. This is revolutionary.

## Your Task

Open `problem.html` in your browser (with the API server running).

You'll see a page with a "Load Team" button. Right now, clicking it does nothing
useful — just logs to the console.

**Your job: complete the `fetchUsers()` function** using raw `XMLHttpRequest`:

1. **Create** a new `XMLHttpRequest` instance
2. **Open** a `GET` request to `http://localhost:3069/api/users?delay=300`
3. **Handle** the response in `onreadystatechange`:
   - Check that `readyState` is `4` (DONE)
   - Check that `status` is `200` (OK)
   - Parse the JSON response with `JSON.parse(xhr.responseText)`
   - Call `renderUsers(parsed.data)` with the data array
4. **Handle errors** — if status isn't 200, call `showError()`
5. **Send** the request
6. **Log** the request using `logRequest()` for the network panel

## What to Observe

1. Open **DevTools → Network tab** before clicking the button
2. Click "Load Team" and watch:
   - A single XHR request appears in the network tab
   - The page does **NOT reload** — only the user list updates
   - Compare this to the PHP demo where every action was a full page reload
3. Look at the response — the server returns **JSON data**, not HTML
4. The **browser** (your JavaScript) is responsible for turning that JSON into DOM elements

## Hints

The `XMLHttpRequest` API:

```js
const xhr = new XMLHttpRequest();

// Configure the request (doesn't send it yet)
xhr.open("GET", "http://example.com/api");

// Handle state changes
xhr.onreadystatechange = function() {
  // readyState values:
  // 0 = UNSENT (open() not called)
  // 1 = OPENED (open() called)
  // 2 = HEADERS_RECEIVED (headers received)
  // 3 = LOADING (body loading)
  // 4 = DONE (complete!)

  if (xhr.readyState === 4) {
    // Request complete — but check status!
    if (xhr.status === 200) {
      // Success! Response is in xhr.responseText (a string)
      const data = JSON.parse(xhr.responseText);
    } else {
      // Error! Status could be 404, 500, etc.
    }
  }
};

// Actually send the request
xhr.send();
```

The API returns: `{ data: [...users], total: N }`

## How to Check Your Solution

```bash
# Terminal 1: Start the API server
npm run api

# Terminal 2: Run the test
npm run exercise 01
```

Or just open `problem.html` in your browser and see if users appear when you
click the button.

Compare your solution with `solution.html` when you're done.

## Key Takeaway

`XMLHttpRequest` is the ancestor of every `fetch()` call you'll ever write. It's
verbose and callback-based, which is why libraries like jQuery's `$.ajax()`
became so popular. But understanding XHR helps you appreciate what modern APIs
abstract away.

Before XHR, every interaction required a full page reload. XHR let JavaScript
talk to the server in the background — and that changed everything.
