# Exercise 01: XMLHttpRequest — The Foundation of AJAX

## 📖 Context

The year is 2006. You're building a team directory page. Until now, every time a
user wanted to see the team list, the **entire page** had to reload (like the PHP
demo from Session 1).

Your tech lead just showed you something called `XMLHttpRequest`. It can fetch
data from the server **without reloading the page**.

## 🎯 Your Task

Open `problem.html` in your browser (with the API server running).

You'll see a page with a "Load Team" button. Right now, clicking it does nothing.

Your job: **complete the `fetchUsers()` function** using raw `XMLHttpRequest` to:

1. Create a new `XMLHttpRequest` instance
2. Configure it to make a `GET` request to `http://localhost:3069/api/users?delay=300`
3. Set up the `onreadystatechange` handler to:
   - Check that `readyState` is `4` (DONE) and `status` is `200` (OK)
   - Parse the JSON response body
   - Call `renderUsers(data)` with the parsed data array
4. Handle errors (non-200 status codes)
5. Send the request

## 🔍 What to Observe

1. Open **DevTools → Network tab** before clicking the button
2. Click "Load Team" and watch:
   - A single XHR request appears in the network tab
   - The page does **NOT reload** — only the user list updates
   - Compare this to the PHP demo where every action was a full page reload
3. Look at the response — the server returns **JSON data**, not HTML
4. The **browser** (your JavaScript) is responsible for turning that JSON into DOM elements

## 💡 Hints

- `XMLHttpRequest` has these key methods: `open(method, url)` and `send()`
- The `readyState` property goes through values 0→1→2→3→4
- You only care about `readyState === 4` (request complete)
- The response body is in `xhr.responseText` — it's a string, you need `JSON.parse()`
- The API returns `{ data: [...users], total: N }`

## ✅ How to Check Your Solution

```bash
# Start the API server (in one terminal)
npm run api

# Run the test for this exercise (in another terminal)
npm run exercise 01
```

Or just open `problem.html` in your browser and see if users appear when you
click the button.

Compare your solution with `solution.html` when you're done.

## 🧠 Key Takeaway

Before XHR, every interaction required a full page reload. XHR let JavaScript
talk to the server in the background. The API is verbose and clunky — you'll see
why jQuery's `$.ajax()` was such a relief in the next exercise.
