import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <div className="exercise-container">
      <h1>
        <span className="accent">Session 06:</span> Server Loaders
      </h1>
      <p className="description">
        Same loader pattern from Session 05, but now the loader runs on the <strong>server</strong>.
        Compare what happens in the Network tab.
      </p>

      <div className="comparison-note">
        <h3>05-loaders vs 06-server-loaders</h3>
        <p>
          In <strong>05-loaders</strong> (TanStack Router), the loader runs in the browser.
          Open Network tab → you see <code>localhost:3069/api/*</code> requests from browser.
        </p>
        <p style={{ marginTop: '0.5rem' }}>
          In <strong>06-server-loaders</strong> (TanStack Start), the loader runs on the server.
          The browser receives HTML with data already embedded.
        </p>
      </div>

      <div className="route-cards">
        <Link to="/demo" search={{ userId: 1 }} className="route-card">
          <div className="card-header">
            <h2>Server Functions</h2>
            <span className="badge">Security</span>
          </div>
          <p>
            Compare SSR with React Query vs Server Functions.
            See how server functions filter sensitive data and aggregate API calls.
          </p>
        </Link>

        <Link to="/streaming/blocking" className="route-card">
          <div className="card-header">
            <h2>Streaming</h2>
            <span className="badge accent">Performance</span>
          </div>
          <p>
            Compare blocking (await all) vs streaming (defer).
            Same data, dramatically different perceived performance.
          </p>
        </Link>

        <Link to="/static/ssg" className="route-card">
          <div className="card-header">
            <h2>Static Generation</h2>
            <span className="badge" style={{ background: 'var(--success)', color: 'var(--bg-primary)' }}>Caching</span>
          </div>
          <p>
            Compare SSG (build-time) vs ISR (revalidating).
            Pre-render pages for instant load, with optional freshness.
          </p>
        </Link>
      </div>
    </div>
  )
}
