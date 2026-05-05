import {
  HeadContent,
  Scripts,
  Outlet,
  Link,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import type { QueryClient } from '@tanstack/react-query'

import appCss from '../styles.css?url'

interface RouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Session 06: Server Loaders',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  component: RootLayout,
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}

function RootLayout() {
  return (
    <>
      {/* Workshop Banner */}
      <div className="workshop-banner">
        <span>
          Data Fetching Workshop → <strong>Session 06: Server Loaders</strong>
        </span>
        <nav className="nav-links">
          <Link
            to="/"
            activeProps={{ className: 'active' }}
            activeOptions={{ exact: true }}
          >
            Home
          </Link>
          <Link
            to="/demo"
            activeProps={{ className: 'active' }}
          >
            Server Functions
          </Link>
          <Link
            to="/streaming"
            activeProps={{ className: 'active' }}
          >
            Streaming
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <Outlet />
    </>
  )
}
