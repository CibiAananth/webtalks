---
routeAlias: vite-default
headingLevel: 2
---

## Vite Configuration

<div class="mt-4">

- Vite uses a file called `vite.config.[js, ts]` for configuration.
- This file is used to configure the plugins, server, build options etc.

The default configuration file looks like this:

````md magic-move

```typescript
import { defineConfig } from 'vite'

export default defineConfig({
  // config options
})
```

```typescript {*|2|5}
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

````

</div>
