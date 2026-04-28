# Exercise 01: XHR Basics — Speaker Notes

## Learning Objectives
- Understand the historical significance of XMLHttpRequest
- Experience the verbosity of raw XHR (why jQuery became popular)
- See the fundamental pattern: request → callback → DOM update

## Setup (~2 min)
1. Make sure API server is running: `cd 01-php && php -S localhost:3069`
2. Open `02-ajax/exercises/01-xhr-basics/problem.html` in browser
3. Open DevTools → Network tab (filter by XHR/Fetch)

## Talk Track

### Historical Context (~3 min)
"It's 2006. Before this, every user interaction required a full page reload. Click a button? Server generates a new HTML page. Submit a form? Full reload. This is how the PHP demo worked."

"XMLHttpRequest changed everything. For the first time, JavaScript could talk to the server in the background. The page stays put, only the data changes. This is what 'AJAX' means — Asynchronous JavaScript And XML."

**Ask participants:** "How many of you have actually written raw XHR code?" (Usually very few hands)

### Live Coding Demo (~10 min)
Walk through the XHR pattern step by step:

```javascript
// 1. Create the request object
const xhr = new XMLHttpRequest();

// 2. Configure it (doesn't send yet)
xhr.open("GET", "http://localhost:3069/api/users?delay=300");

// 3. Set up the callback
xhr.onreadystatechange = function() {
  // readyState 4 = request complete
  if (xhr.readyState === 4) {
    if (xhr.status === 200) {
      // Success! Parse and render
      const data = JSON.parse(xhr.responseText);
      renderUsers(data.data);
    } else {
      // Error
      showError();
    }
  }
};

// 4. Actually send it
xhr.send();
```

**Key points to emphasize:**
- "Notice we create the object, configure it, set up the callback, THEN send. Very imperative."
- "readyState goes through 5 states (0-4). We only care about 4 (DONE)."
- "We have to manually check status. readyState 4 just means 'complete', not 'successful'."
- "Response is a string. We have to JSON.parse() it ourselves."

### Participant Exercise (~5 min)
"Your turn. Open `problem.html` in your editor. Find the `fetchUsers()` function. Implement it using the pattern we just saw."

Walk around, help anyone stuck.

### Observation (~3 min)
After they complete it:
1. "Click the button. Watch the Network tab."
2. "See that single XHR request? The page didn't reload."
3. "The server sent JSON, not HTML. Your JavaScript turned it into DOM elements."

**Ask:** "How many lines of code did that take?" (About 15-20)

"This is why jQuery became so popular. `$.get(url, callback)` does all of this in one line."

### Key Takeaway (~2 min)
"XHR is the ancestor of every `fetch()` call you'll ever write. It's verbose, callback-based, and requires manual JSON parsing. But understanding it helps you appreciate what modern APIs abstract away."

"Before XHR, every interaction was a page reload. XHR let JavaScript talk to servers in the background — and that changed the web forever."

## Common Questions

**Q: Why is it called XMLHttpRequest if we're using JSON?**
A: Historical artifact. In 2006, XML was the dominant data format. JSON won later, but the name stuck.

**Q: What about fetch()? Why learn XHR?**
A: fetch() is built on top of these concepts. Understanding XHR helps you debug when things go wrong and understand older codebases.

**Q: What are the readyState values?**
A: 0=UNSENT, 1=OPENED, 2=HEADERS_RECEIVED, 3=LOADING, 4=DONE. You almost always just check for 4.

## Time Budget
- Setup: 2 min
- Historical context: 3 min
- Live coding demo: 10 min
- Participant exercise: 5 min
- Observation: 3 min
- Key takeaway: 2 min
- **Total: ~25 min**
