import { createFileRoute, Link, Outlet, useNavigate, useLocation } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'

interface DemoSearch {
  userId?: number
}

export const Route = createFileRoute('/demo')({
  component: DemoLayout,
  validateSearch: (search: Record<string, unknown>): DemoSearch => {
    return {
      userId: typeof search.userId === 'number' ? search.userId : 1,
    }
  },
})

function DemoLayout() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const location = useLocation()
  const currentUserId = Route.useSearch({ select: (s) => s.userId ?? 1 })

  // Determine current tab from pathname
  const isLoaderTab = location.pathname.includes('with-loader')
  const currentTab = isLoaderTab ? '/demo/with-loader' : '/demo/suspense'

  const handleReload = () => {
    // Clear cache to force fresh fetches
    queryClient.clear()
    // Re-navigate to current tab to force fresh load
    navigate({ to: currentTab, search: { userId: currentUserId } })
  }

  const handleUserChange = (userId: number) => {
    // Clear cache when changing users
    queryClient.clear()
    // Stay on current tab when changing users
    navigate({ to: currentTab, search: { userId } })
  }

  return (
    <div className="exercise-container">
      <h1>
        <span className="accent">Part 1:</span> Suspense vs Route Loader
      </h1>
      <p className="description">
        Same data, same UI. Two fetching strategies. Open the Network tab to see the difference.
      </p>

      {/* Tab navigation */}
      <div className="tab-nav">
        <Link
          to="/demo/suspense"
          search={{ userId: currentUserId }}
          activeProps={{ className: 'active' }}
        >
          Suspense
        </Link>
        <Link
          to="/demo/with-loader"
          search={{ userId: currentUserId }}
          activeProps={{ className: 'active' }}
        >
          Route Loader
        </Link>
        <button className="btn-ghost btn-small" onClick={handleReload} style={{ marginLeft: 'auto' }}>
          Reload (clear cache)
        </button>
      </div>

      {/* User selector */}
      <div style={{ marginBottom: '1.5rem' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginRight: '0.75rem' }}>
          Select user:
        </span>
        <div className="user-selector" style={{ display: 'inline-flex' }}>
          {[1, 2, 3, 4, 5].map((id) => (
            <button
              key={id}
              className={currentUserId === id ? 'active' : ''}
              onClick={() => handleUserChange(id)}
            >
              User {id}
            </button>
          ))}
        </div>
      </div>

      {/* Child route content */}
      <Outlet />

      {/* Teaching content */}
      <div className="teaching-grid">
        <div className="teaching-box">
          <h4>When do fetches START?</h4>
          <p>
            <strong>Suspense:</strong> Fetches start when components <em>mount</em>. Mount happens
            after JS download → parse → hydrate → render. On a slow connection, that's seconds of
            delay before any fetch begins.
          </p>
          <p style={{ marginTop: '0.5rem' }}>
            <strong>Loader:</strong> Fetches start at <em>navigation time</em>. The moment you
            click the link, the loader fires. No waiting for JS or React.
          </p>
        </div>

        <div className="teaching-box">
          <h4>The mount-to-fetch gap</h4>
          <p>
            Even sibling Suspense (parallel fetches) has a hidden cost. Between navigation and
            fetch-start, you're waiting for the JS bundle. On localhost it's instant. In
            production with a 200KB bundle over 3G? That's 2+ seconds before fetches even begin.
          </p>
          <p style={{ marginTop: '0.5rem' }}>
            Loaders eliminate this gap entirely.
          </p>
        </div>

        <div className="teaching-box">
          <h4>Dependent fetches</h4>
          <p>
            If comments need the first post's ID, both approaches must await posts first. But with
            Suspense, there's a <em>render cycle</em> between posts resolving and comments starting
            (mount → effect → fetch). With a loader, it's just <code>await</code> → <code>await</code> —
            microseconds, not frames.
          </p>
        </div>
      </div>
    </div>
  )
}
