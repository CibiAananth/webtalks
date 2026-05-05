import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

function LandingPage() {
  return (
    <div className="exercise-container">
      <h1>
        <span className="accent">05.</span> Route Loaders
      </h1>
      <p className="description">
        Route loaders fetch data <strong>BEFORE</strong> components render.
        In this session you'll see why that matters.
      </p>

      <div className="side-by-side" style={{ marginTop: '2rem' }}>
        <Link to="/demo" className="landing-card">
          <div className="landing-card-number">Part 1</div>
          <h2>Demo</h2>
          <p>
            See Suspense vs Route Loaders side by side.
            Both fetch in parallel — but the UX is different.
            One shows skeletons, one shows the complete page.
          </p>
        </Link>

        <Link to="/exercise" className="landing-card">
          <div className="landing-card-number">Part 2</div>
          <h2>Exercise</h2>
          <p>
            A profile page with a 3-level waterfall.
            Your task: add a route loader to eliminate it.
          </p>
        </Link>
      </div>

      <div className="insight-box" style={{ marginTop: '2rem' }}>
        <h3>What you'll learn</h3>
        <ul style={{ marginTop: '0.75rem', paddingLeft: '1.5rem', display: 'grid', gap: '0.5rem' }}>
          <li>Why component-level fetching creates waterfalls</li>
          <li>How route loaders work with TanStack Router</li>
          <li>Using <code>queryClient.ensureQueryData()</code> to prefetch</li>
          <li>The difference between component loading states and navigation loading states</li>
        </ul>
      </div>
    </div>
  )
}
