import { createFileRoute, Link, Outlet,  } from '@tanstack/react-router'

export const Route = createFileRoute('/streaming')({
  component: StreamingLayout,
})

function StreamingLayout() {
  return (
    <div className="exercise-container">
      <h1>
        <span className="accent">Streaming</span> Demo
      </h1>
      <p className="description">
        Compare how blocking vs streaming affects perceived performance.
        Watch the page load — which feels faster?
      </p>

      {/* Tab navigation */}
      <div className="tab-nav">
        <Link
          to="/streaming/blocking"
          activeProps={{ className: 'active' }}
        >
          Blocking (await all)
        </Link>
        <Link
          to="/streaming/deferred"
          activeProps={{ className: 'active' }}
        >
          Streaming (defer)
        </Link>
      </div>

      {/* Timing legend */}
      <div style={{
        marginBottom: '1.5rem',
        padding: '1rem',
        background: 'var(--bg-secondary)',
        borderRadius: '8px',
        fontSize: '0.85rem',
        color: 'var(--text-secondary)'
      }}>
        <strong style={{ color: 'var(--text-primary)' }}>API delays:</strong>{' '}
        User Profile (300ms) • Posts (800ms) • Activity Stats (1500ms) • Recommendations (2500ms)
      </div>

      {/* Child route content */}
      <Outlet />
    </div>
  )
}
