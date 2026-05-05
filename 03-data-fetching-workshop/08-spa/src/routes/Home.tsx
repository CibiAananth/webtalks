import { Link } from 'react-router-dom'

export function Home() {
  return (
    <div className="page-wrap py-12">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-bold text-[var(--sea-ink)]">Traditional SPA Demo</h1>
        <p className="mt-4 text-[var(--sea-ink-soft)]">
          This is a client-only React app using React Query for data fetching.
          <br />
          No SSR, no route loaders, no Suspense boundaries.
        </p>

        <div className="mt-8 rounded-xl border border-[var(--line)] bg-[var(--surface)] p-6 text-left">
          <h3 className="font-semibold text-[var(--sea-ink)]">What to observe:</h3>
          <ul className="mt-3 space-y-2 text-sm text-[var(--sea-ink-soft)]">
            <li>• Navigate to <strong>/demo</strong> and watch the loading sequence</li>
            <li>• User card loads first (blocking)</li>
            <li>• Then appointments and notes load in parallel</li>
            <li>• Notice the "waterfall" - can't show content until JS loads + executes</li>
            <li>• Check Network tab - everything loads client-side</li>
          </ul>
        </div>

        <Link
          to="/demo"
          className="mt-8 inline-block rounded-lg bg-[var(--lagoon)] px-6 py-3 font-medium text-white transition hover:bg-[var(--lagoon-deep)]"
        >
          Go to Demo →
        </Link>
      </div>
    </div>
  )
}
