---
routeAlias: live-reload
headingLevel: 2
---

## Live Reload

<div class="mt-5">

  Vite has a built-in live reload feature for React applications, but our use case is a bit different. We want the browser to reload as well as the chrome extension whenever we make changes to our code.

<div v-click>

Here are the overall steps:


1. Watch for file changes

</div>

<div v-click>

2. When a file changes, rebuild the extension

</div>

<div v-click>

3. Reload the extension

</div>

<div v-click>

4. Reload the browser

</div>

<div v-click>

Among this list, the first two steps are already taken care of by Vite. We just need to add the last two steps.

</div>

</div>

<!-- 
Change the dev script to `"vite build -w --mode development"` to watch for file changes and rebuild the extension.
Show a quick demo of the live rebuild feature.


if we want to reload the extension, we can use the `chrome.runtime.reload()` method in the background script.
Quick demo of background script use case.

#1 Quiz:
Generally how do we reload the browser?

#2 Quiz:
Now we know how to reload the extension, and assuming we also have a way to detect when the extension is rebuilt, how do we reload the extension?
How does the background script know when the extension is rebuilt? how to communicate it realtime?

 -->