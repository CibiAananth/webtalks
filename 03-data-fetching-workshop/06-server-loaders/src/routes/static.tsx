import { createFileRoute, Link, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/static')({
  component: StaticLayout,
})

function StaticLayout() {
  return (
    <div className="exercise-container">
      <h1>
        <span className="accent">Static Generation</span> Demo
      </h1>
      <p className="description">
        Compare SSG (Static Site Generation) vs ISR (Incremental Static Regeneration).
        Watch the timestamps to see when pages were generated.
      </p>

      {/* Tab navigation */}
      <div className="tab-nav">
        <Link
          to="/static/ssg"
          activeProps={{ className: 'active' }}
        >
          SSG (Build Time)
        </Link>
        <Link
          to="/static/isr"
          activeProps={{ className: 'active' }}
        >
          ISR (Revalidate)
        </Link>
      </div>

      {/* Concept explanation */}
      <div style={{
        marginBottom: '1.5rem',
        padding: '1rem',
        background: 'var(--bg-secondary)',
        borderRadius: '8px',
        fontSize: '0.85rem',
        color: 'var(--text-secondary)'
      }}>
        <strong style={{ color: 'var(--text-primary)' }}>Key Concepts:</strong>{' '}
        <span style={{ color: 'var(--accent-light)' }}>SSG</span> = HTML generated at build time, never changes until next deploy.{' '}
        <span style={{ color: 'var(--success)' }}>ISR</span> = HTML generated at build time, but revalidates after a set interval.
      </div>

      {/* Child route content */}
      <Outlet />
    </div>
  )
}
