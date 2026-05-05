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

  const isServerFn = location.pathname.includes('server-fn')
  const currentTab = isServerFn ? '/demo/server-fn' : '/demo/profile'

  const handleReload = () => {
    queryClient.clear()
    window.location.reload()
  }

  const handleUserChange = (userId: number) => {
    queryClient.clear()
    navigate({ to: currentTab, search: { userId } })
  }

  return (
    <div className="exercise-container">
      <h1>
        <span className="accent">Server Loaders</span> Demo
      </h1>
      <p className="description">
        Compare the Network tab responses between these two approaches.
      </p>

      {/* Tab navigation */}
      <div className="tab-nav">
        <Link
          to="/demo/profile"
          search={{ userId: currentUserId }}
          activeProps={{ className: 'active' }}
        >
          SSR (with React Query)
        </Link>
        <Link
          to="/demo/server-fn"
          search={{ userId: currentUserId }}
          activeProps={{ className: 'active' }}
        >
          Server Functions
        </Link>
        <button className="btn-ghost btn-small" onClick={handleReload} style={{ marginLeft: 'auto' }}>
          Hard Reload
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
    </div>
  )
}
