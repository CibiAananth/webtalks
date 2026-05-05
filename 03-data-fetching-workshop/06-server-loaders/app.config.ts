import { defineConfig } from '@tanstack/react-start/config'

export default defineConfig({
  server: {
    // Pre-render these routes at build time
    prerender: {
      routes: ['/static/ssg', '/static/isr'],
    },
    // Route rules for caching behavior and headers
    routeRules: {
      // SSG: Serve as static, no revalidation
      '/static/ssg': {
        prerender: true,
        headers: {
          // Custom header to prove SSG in Network tab
          'x-render-mode': 'SSG (Static Site Generation)',
          'x-generated-at': 'build-time',
          // Long cache - immutable until next build
          'cache-control': 'public, max-age=31536000, immutable',
        },
      },
      // ISR: Revalidate every 10 seconds (short for demo, typically 60-3600 in production)
      '/static/isr': {
        isr: 10,
        headers: {
          // Custom header to prove ISR in Network tab
          'x-render-mode': 'ISR (Incremental Static Regeneration)',
          'x-revalidate-seconds': '10',
          // SWR cache control
          'cache-control': 'public, s-maxage=10, stale-while-revalidate=86400',
        },
      },
    },
  },
})
