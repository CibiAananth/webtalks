---
routeAlias: manifest-file
headingLevel: 2
---

## Manifest file

<div class="mt-3">

* The <a target="_blank" href="https://developer.chrome.com/docs/extensions/reference/manifest">manifest file</a> contains metadata about the extension such as name, version, permissions, etc.
* It is a JSON file named `manifest.json` and must be present in the root directory of the extension.
* Without a manifest file, a Chrome extension won't work.

</div>

<div class="mt-10">

<<< @/snippets/manifest.json {monaco-run}

</div>

<!--
 description and icons are only needed for Chrome Web Store

 which means that the bare minimum things needed to create a chrome extension are the above keys, 
anyway it won't be useful without the other keys like `content_scripts` , `background` , `permissions` , etc.

Let's do a quick check by creating a simple extension with the above manifest file.
 -->
