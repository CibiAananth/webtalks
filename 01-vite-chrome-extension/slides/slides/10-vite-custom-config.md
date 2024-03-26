---
routeAlias: vite-custom-config
headingLevel: 2
---

## Vite Custom Config

<div class="mt-5">

  - Now let's recrate the popup.html with React
  - We will use Vite to transpile the React code to a format that can be used in the browser

</div>

<div v-click class="mt-4">

For custom config we'll use the [rollupOptions](https://vitejs.dev/config/build-options.html#build-rollupoptions) in vite.config.ts

````md magic-move {at:2}

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        popup: '/src/popup/index.html',
      },
    },
  },
})
```


```ts {10}
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        popup: '/src/popup/index.html',
        content: '/src/content-scripts/index.ts',
      },
    },
  },
})
```

````

</div>


<!-- 
1. Create new vite project
2. Delete everything in src 
3. create popup/index.html, popup/index.tsx, popup/App.tsx
4. create build/manifest.json

5. demo with root manifest.json
6. use custom popup config.
7. pain point of copying manifest.json, we can keep at root but it will include all source files too
8. 

8. create content-script/index, const.ts
9. build and show the file name
10. problem to solve with filename
 -->