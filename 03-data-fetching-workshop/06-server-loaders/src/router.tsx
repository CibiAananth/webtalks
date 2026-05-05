import { QueryClient } from '@tanstack/react-query'
import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'
import { routeTree } from './routeTree.gen'

export interface RouterContext {
  queryClient: QueryClient
}

export function getRouter() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 0, // Data considered stale immediately for demo purposes
        refetchOnWindowFocus: false, // Disable to avoid confusing refetches during demo
      },
    },
  })

  const router = createTanStackRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreload: false, // Disable preloading so audience can see no API calls from browser
    defaultPreloadStaleTime: 0,
  })

  // Set up SSR integration - this handles:
  // - Automatic dehydration of QueryClient on server
  // - Automatic hydration of QueryClient on client
  // - Streaming of queries that resolve during SSR
  setupRouterSsrQueryIntegration({
    router,
    queryClient,
  })

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
