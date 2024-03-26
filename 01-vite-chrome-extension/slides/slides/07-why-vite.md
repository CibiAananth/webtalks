---
routeAlias: why-vite
headingLevel: 2
---

## Why do we need Vite for this? 

<!-- Although this is a simple use case, in our extension we need to show the popup when extension is clicked  -->
<div class="mt-5" v-click>

- Regardless of the complexity of the extension, we may often end up having multiple files that is exported/imported in the main script file.
- We need to bundle these files into a single file to be used in the extension.

</div>

<div class="mt-5" v-click>

- Assume we have lot of html content to be displayed, so we will end up using React as our framework.
- Now we need to bundle the React files and its dependencies into a JavaScript file.

</div>


<div class="mt-5" v-click>

- Vite is preferred over Webpack for this use case as it is faster in bundling the files.
- Vite uses ESBuild for bundling which is faster than Webpack.
- Vite is also preferred for its hot module replacement feature.

</div>