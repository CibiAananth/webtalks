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
          <h2>Demo: Server Loader</h2>
          <p>See the loader run on the server. Compare Network tab with 05-loaders.</p>
        </Link>
      </div>
    </div>
  )
}
