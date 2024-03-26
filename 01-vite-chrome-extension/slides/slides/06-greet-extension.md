---
routeAlias: greet-extension
headingLevel: 2
---

## Greet Extension

Let's create a simple chrome extension to greet the user when the extension icon is clicked with an alert like this:

```js
alert('Hello, World!');
```

<!-- Since this is JS we need to include it to the manifest file -->
This can be done by adding a `content_scripts` to the `manifest.json` file which is a list of scripts that should be injected into web pages.

````md magic-move

```json
{
  "manifest_version": 3,
  "name": "Minimal Manifest",
  "version": "1.0.0"
}

```

```json {5|7-8}
{
  "manifest_version": 3,
  "name": "Minimal Manifest",
  "version": "1.0.0"
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["greet.js"]
    }
  ]
}
```

````

<!-- 
  Additional talk about popup and a sample popup.html file
 -->