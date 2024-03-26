---
routeAlias: socket-usecase
headingLevel: 2
---

## Socket connection

The easiest way is to add socket logic to "content" and "background" scripts and listen for server events to reload. But the problem is they will be available on production as well. We need a way to inject them only in development.

Here's where we can leverage Vite custom plugins.

<div class="mt-2">

Since Vite uses Rollup under the hood, we can use <a target="blank" href="https://rollupjs.org/plugin-development/#transformers">transformers</a> to modify the code before it's bundled.


<div v-click class="mt-2">

```ts twoslash
import { PluginOption } from 'vite';

export function addLiveReload(): PluginOption {
  return {
    name: 'add-liveReload',
    transform(code, id) {
      code += `console.log("Live reload script injected")`;
      return { code };
    }
  }
};
```

</div>

</div>


<!--


-->