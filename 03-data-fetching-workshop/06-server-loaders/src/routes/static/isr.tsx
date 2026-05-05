import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { UserCard } from '../../components'
import type { User } from '../../types'

// ════════════════════════════════════════════════════════════════════════════════
// ISR (INCREMENTAL STATIC REGENERATION)
//
// This page is pre-rendered at BUILD TIME, but can be REVALIDATED after deployment.
// When a request comes in after the revalidation period, the page is regenerated
// in the background while serving the stale version.
//
// Use cases:
// - Product listings (update every few minutes)
// - News feeds (update every hour)
// - Dashboards with semi-fresh data
// - Any content that changes periodically
// ════════════════════════════════════════════════════════════════════════════════

// Revalidation interval in seconds (short for demo, typically 60-3600 in production)
const REVALIDATE_SECONDS = 10

// Server function that returns user data
// In a real app, this would fetch from a database/API
const fetchISRUser = createServerFn().handler(async (): Promise<User> => {
  // Mock data for demo - in production, fetch fresh data
  return {
    id: 2,
    name: 'Bob Smith',
    email: 'bob@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob',
    role: 'editor',
    joined: '2023-03-22',
  }
})

// Type for the stats data
type LiveStats = {
  generatedAt: string
  revalidateAfter: number
  requestId: string
  liveData: {
    activeUsers: number
    serverLoad: number
    lastOrder: string
    stockPrice: number
  }
}

// Server function - runs on every request that isn't cached by CDN
const fetchLiveStats = createServerFn().handler(async (): Promise<LiveStats> => {
  console.log('[ISR] Server function executed at:', new Date().toISOString())
  return {
    generatedAt: new Date().toISOString(),
    revalidateAfter: REVALIDATE_SECONDS,
    requestId: Math.random().toString(36).substring(2, 10),
    liveData: {
      activeUsers: Math.floor(Math.random() * 1000) + 500,
      serverLoad: Math.floor(Math.random() * 100),
      lastOrder: `ORD-${Date.now().toString(36).toUpperCase()}`,
      stockPrice: Number((150 + Math.random() * 10).toFixed(2)),
    },
  }
})

export const Route = createFileRoute('/static/isr')({
  // Cache headers for ISR - CDN will cache and revalidate
  headers: () => ({
    // Cache-Control for ISR behavior:
    // - public: CDN can cache this
    // - max-age=0: Browser should always revalidate
    // - s-maxage=10: CDN caches for 10 seconds
    // - stale-while-revalidate=86400: Serve stale while fetching fresh (up to 24h)
    'Cache-Control': `public, max-age=0, s-maxage=${REVALIDATE_SECONDS}, stale-while-revalidate=86400`,
    'CDN-Cache-Control': `public, max-age=${REVALIDATE_SECONDS}, stale-while-revalidate=86400`,
    'x-render-mode': 'ISR',
    'x-revalidate-seconds': String(REVALIDATE_SECONDS),
  }),

  // Loader runs when CDN cache misses or revalidates
  loader: async () => {
    const [user, stats] = await Promise.all([
      fetchISRUser(),
      fetchLiveStats(),
    ])
    return { user, stats }
  },

  component: ISRPage,
})

function ISRPage() {
  const { user, stats } = Route.useLoaderData()

  const generatedDate = new Date(stats.generatedAt)
  const nextRevalidation = new Date(generatedDate.getTime() + stats.revalidateAfter * 1000)

  return (
    <div>
      {/* ISR Info Banner */}
      <div style={{
        background: 'var(--success-bg)',
        border: '1px solid var(--success)',
        borderRadius: '8px',
        padding: '1rem',
        marginBottom: '1.5rem'
      }}>
        <strong style={{ color: 'var(--success)' }}>Incremental Static Regeneration (ISR)</strong>
        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          This page revalidates every <strong>{REVALIDATE_SECONDS} seconds</strong>.
          Data is re-fetched from the server <strong>without redeploying</strong>.
        </p>
      </div>

      {/* LIVE DATA - This changes on revalidation WITHOUT redeploy */}
      <div className="workspace" style={{ marginBottom: '1.5rem', borderColor: 'var(--success)' }}>
        <h3>
          Live Dashboard Data{' '}
          <span style={{ fontSize: '0.8rem', color: 'var(--success)', fontWeight: 400 }}>
            (changes on revalidation - NO redeploy!)
          </span>
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
          <div style={{ textAlign: 'center', padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: '8px' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-light)' }}>
              {stats.liveData.activeUsers}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Active Users</div>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: '8px' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--warning)' }}>
              {stats.liveData.serverLoad}%
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Server Load</div>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: '8px' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--success)' }}>
              {stats.liveData.lastOrder}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Last Order</div>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: '8px' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              ${stats.liveData.stockPrice}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Stock Price</div>
          </div>
        </div>
        <p style={{
          marginTop: '1rem',
          padding: '0.75rem',
          background: 'var(--warning-bg)',
          border: '1px solid var(--warning)',
          borderRadius: '6px',
          fontSize: '0.85rem',
          color: 'var(--text-secondary)'
        }}>
          <strong style={{ color: 'var(--warning)' }}>Demo:</strong> Wait {REVALIDATE_SECONDS}s, refresh twice.
          These values will change — proving ISR re-fetched data without a redeploy!
        </p>
      </div>

      {/* Generation Info */}
      <div className="workspace" style={{ marginBottom: '1.5rem' }}>
        <h3>Generation Metadata</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
              Generated At
            </div>
            <div style={{
              fontFamily: 'monospace',
              fontSize: '0.9rem',
              color: 'var(--success)',
              background: 'var(--bg-tertiary)',
              padding: '0.5rem',
              borderRadius: '4px'
            }}>
              {generatedDate.toLocaleTimeString()}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
              Revalidates After
            </div>
            <div style={{
              fontFamily: 'monospace',
              fontSize: '0.9rem',
              color: 'var(--warning)',
              background: 'var(--bg-tertiary)',
              padding: '0.5rem',
              borderRadius: '4px'
            }}>
              {nextRevalidation.toLocaleTimeString()}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
              Generation ID
            </div>
            <div style={{
              fontFamily: 'monospace',
              fontSize: '0.9rem',
              color: 'var(--accent-light)',
              background: 'var(--bg-tertiary)',
              padding: '0.5rem',
              borderRadius: '4px'
            }}>
              {stats.requestId}
            </div>
          </div>
        </div>
      </div>

      {/* User Data */}
      <div className="workspace">
        <h3>
          User Data{' '}
          <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(revalidates periodically)</span>
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
        <strong style={{ color: 'var(--text-primary)' }}>How ISR Works (Stale-While-Revalidate):</strong>
        <ol style={{ margin: '0.5rem 0 0 0', paddingLeft: '1.25rem', color: 'var(--text-secondary)' }}>
          <li>Page is pre-rendered at build time (like SSG)</li>
          <li>For {REVALIDATE_SECONDS}s, all requests get the cached HTML</li>
          <li>After {REVALIDATE_SECONDS}s, the first request triggers background regeneration</li>
          <li>That request still gets the stale page (fast response)</li>
          <li>Next request gets the fresh page</li>
        </ol>
      </div>

      {/* SWR Diagram */}
      <div style={{
        marginTop: '1rem',
        padding: '1rem',
        background: 'var(--bg-tertiary)',
        borderRadius: '8px',
        fontFamily: 'monospace',
        fontSize: '0.8rem',
        color: 'var(--text-secondary)',
        overflow: 'auto'
      }}>
        <pre style={{ margin: 0 }}>
{`Timeline (revalidate: ${REVALIDATE_SECONDS}s)
────────────────────────────────────────────────────────────
Build    │ Page generated, cached
         │
0-${REVALIDATE_SECONDS}s    │ All requests → serve cached HTML (fast!)
         │
${REVALIDATE_SECONDS}s+     │ Request A → serve stale + trigger regen in background
         │              └── regeneration completes
         │
Next     │ Request B → serve fresh HTML
────────────────────────────────────────────────────────────`}
        </pre>
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
          <strong style={{ color: 'var(--success)' }}>Benefits over SSG</strong>
          <ul style={{ margin: '0.5rem 0 0 0', paddingLeft: '1.25rem', color: 'var(--text-secondary)' }}>
            <li>Fresh data without full rebuild</li>
            <li>Still fast (serves stale while revalidating)</li>
            <li>Scales to millions of pages</li>
            <li>Only regenerates on-demand</li>
          </ul>
        </div>
        <div style={{
          padding: '1rem',
          background: 'var(--warning-bg)',
          border: '1px solid var(--warning)',
          borderRadius: '8px',
          fontSize: '0.85rem'
        }}>
          <strong style={{ color: 'var(--warning)' }}>Considerations</strong>
          <ul style={{ margin: '0.5rem 0 0 0', paddingLeft: '1.25rem', color: 'var(--text-secondary)' }}>
            <li>Data can be up to {REVALIDATE_SECONDS}s stale</li>
            <li>First visitor after interval gets stale data</li>
            <li>Requires server runtime (not pure CDN)</li>
            <li>Platform support varies</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
