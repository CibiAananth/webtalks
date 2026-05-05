import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { UserCard } from '../../components'
import type { User } from '../../types'

// ════════════════════════════════════════════════════════════════════════════════
// SSG (STATIC SITE GENERATION)
//
// This page is pre-rendered at BUILD TIME. The HTML is generated once and served
// as a static file. No server-side code runs on each request.
//
// Use cases:
// - Marketing pages
// - Documentation
// - Blog posts
// - Any content that rarely changes
// ════════════════════════════════════════════════════════════════════════════════

// Server function that returns static user data
// In a real app, this would fetch from a CMS or database at build time
const fetchStaticUser = createServerFn().handler(async (): Promise<User> => {
  // Mock data for demo - in production, fetch from CMS/API
  return {
    id: 1,
    name: 'Alice Johnson',
    email: 'alice@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice',
    role: 'admin',
    joined: '2023-01-15',
  }
})

// Generate timestamp at build time
const fetchBuildInfo = createServerFn().handler(async (): Promise<{
  generatedAt: string
  nodeEnv: string
}> => {
  return {
    generatedAt: new Date().toISOString(),
    nodeEnv: process.env.NODE_ENV || 'development',
  }
})

export const Route = createFileRoute('/static/ssg')({
  // Cache headers for SSG - immutable, cache forever until redeploy
  headers: () => ({
    'Cache-Control': 'public, max-age=31536000, immutable',
    'x-render-mode': 'SSG',
  }),

  // This loader runs at BUILD TIME when prerendering is enabled
  // The result is embedded in the static HTML
  loader: async () => {
    console.log('[SSG] Loader executed at:', new Date().toISOString())
    const [user, buildInfo] = await Promise.all([
      fetchStaticUser(),
      fetchBuildInfo(),
    ])
    return { user, buildInfo }
  },

  component: SSGPage,
})

function SSGPage() {
  const { user, buildInfo } = Route.useLoaderData()

  return (
    <div>
      {/* SSG Info Banner */}
      <div style={{
        background: 'var(--accent-bg)',
        border: '1px solid var(--accent)',
        borderRadius: '8px',
        padding: '1rem',
        marginBottom: '1.5rem'
      }}>
        <strong style={{ color: 'var(--accent-light)' }}>Static Site Generation (SSG)</strong>
        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          This page was generated at <strong>build time</strong>. The timestamp below is frozen —
          it won't change until you rebuild the application.
        </p>
      </div>

      {/* Build Info */}
      <div className="workspace" style={{ marginBottom: '1.5rem' }}>
        <h3>Build Information</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
              Generated At
            </div>
            <div style={{
              fontFamily: 'monospace',
              fontSize: '0.95rem',
              color: 'var(--accent-light)',
              background: 'var(--bg-tertiary)',
              padding: '0.5rem',
              borderRadius: '4px'
            }}>
              {new Date(buildInfo.generatedAt).toLocaleString()}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
              Environment
            </div>
            <div style={{
              fontFamily: 'monospace',
              fontSize: '0.95rem',
              color: buildInfo.nodeEnv === 'production' ? 'var(--success)' : 'var(--warning)',
              background: 'var(--bg-tertiary)',
              padding: '0.5rem',
              borderRadius: '4px'
            }}>
              {buildInfo.nodeEnv}
            </div>
          </div>
        </div>
      </div>

      {/* Static User Data */}
      <div className="workspace">
        <h3>
          Pre-rendered User Data{' '}
          <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(fetched at build time)</span>
        </h3>
        <UserCard user={user} />
      </div>

      {/* How it works */}
      <div style={{
        marginTop: '1.5rem',
        padding: '1rem',
        background: 'var(--bg-secondary)',
        borderRadius: '8px',
        fontSize: '0.85rem'
      }}>
        <strong style={{ color: 'var(--text-primary)' }}>How SSG Works:</strong>
        <ol style={{ margin: '0.5rem 0 0 0', paddingLeft: '1.25rem', color: 'var(--text-secondary)' }}>
          <li>During <code>pnpm build</code>, Nitro pre-renders this route</li>
          <li>The loader runs ONCE, fetching data from the API</li>
          <li>HTML is generated with the data embedded</li>
          <li>On each request, the static HTML is served (no server code runs)</li>
          <li>To update the data, you must rebuild and redeploy</li>
        </ol>
      </div>

      {/* Trade-offs */}
      <div style={{
        marginTop: '1rem',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1rem'
      }}>
        <div style={{
          padding: '1rem',
          background: 'var(--success-bg)',
          border: '1px solid var(--success)',
          borderRadius: '8px',
          fontSize: '0.85rem'
        }}>
          <strong style={{ color: 'var(--success)' }}>Benefits</strong>
          <ul style={{ margin: '0.5rem 0 0 0', paddingLeft: '1.25rem', color: 'var(--text-secondary)' }}>
            <li>Instant TTFB (Time to First Byte)</li>
            <li>CDN-cacheable worldwide</li>
            <li>Zero server compute per request</li>
            <li>Maximum reliability</li>
          </ul>
        </div>
        <div style={{
          padding: '1rem',
          background: 'var(--error-bg)',
          border: '1px solid var(--error)',
          borderRadius: '8px',
          fontSize: '0.85rem'
        }}>
          <strong style={{ color: 'var(--error)' }}>Limitations</strong>
          <ul style={{ margin: '0.5rem 0 0 0', paddingLeft: '1.25rem', color: 'var(--text-secondary)' }}>
            <li>Data is stale until next build</li>
            <li>Rebuild required for updates</li>
            <li>Not suitable for dynamic content</li>
            <li>Build time grows with page count</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
