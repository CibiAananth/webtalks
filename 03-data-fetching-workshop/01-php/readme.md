# Session 1 Demo: PHP Team Directory

A complete web application with **zero JavaScript**.

This demonstrates how web apps worked before AJAX/SPAs:
- Server fetches data and renders HTML in one step
- Every interaction (add user, delete user) causes a full page reload
- Forms use the POST-Redirect-GET pattern
- No loading spinners, no skeleton screens — the page is either there or it isn't

## How to Run

You only need Docker installed. No PHP installation required.

```bash
cd php-demo
docker run --rm -p 8080:80 -v "$(pwd)":/var/www/html php:8.2-apache
```

Then open [http://localhost:8080](http://localhost:8080)

## What to Observe

1. **Open DevTools → Network tab** before interacting with the page
2. **Add a user** — watch the network tab. You'll see:
   - A POST request (form submission)
   - A 302 redirect response
   - A GET request (page reload)
   - The entire HTML page downloaded again
3. **Delete a user** — same thing: POST → redirect → full page reload
4. **Check the timestamp** at the bottom — it changes on every load, proving the entire page is freshly rendered each time
5. **Try submitting an empty form** — the page reloads, shows an error, and your form inputs are gone

## Key Talking Points

- There is literally no JavaScript on this page. View the source.
- The server does ALL the work: data access, validation, rendering.
- The browser is just a display — it receives finished HTML and shows it.
- This was the standard way to build web apps from ~1995 to ~2010.
- It's simple, it works, and it has zero client-side bugs. But every interaction is a full page reload.
