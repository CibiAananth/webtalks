import { createRootRouteWithContext, Link, Outlet } from '@tanstack/react-router'
import { QueryClient } from '@tanstack/react-query'

interface RouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
})

function RootLayout() {
  return (
    <>
      {/* Workshop Banner */}
      <header className="workshop-banner">
        <span>
          Data Fetching Workshop <span className="accent">→</span> Session 05: Route Loaders
        </span>
        <nav className="exercise-nav">
          <Link to="/" activeProps={{ className: 'active' }} activeOptions={{ exact: true }}>
            Home
          </Link>
          <Link to="/demo" activeProps={{ className: 'active' }}>
            Demo
          </Link>
          <Link to="/exercise" activeProps={{ className: 'active' }}>
            Exercise
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>
    </>
  )
}
