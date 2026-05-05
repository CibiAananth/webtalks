import { Suspense } from 'react'
import { createFileRoute, Await, defer } from '@tanstack/react-router'
import { queryOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { UserCard, PostCard, Skeleton } from '../../components'
import type { User, Post } from '../../types'

const API_BASE = 'http://localhost:3069/api'

// ════════════════════════════════════════════════════════════════════════════════
// STREAMING + REACT QUERY + SERVER FUNCTIONS
//
// Best of all worlds:
// - Server functions: data filtering, internal APIs, secrets stay on server
// - React Query: caching, background refetch, deduplication
// - Streaming: critical data blocks, non-critical streams in progressively
// ════════════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────────
// Server Functions (run on server only)
// ─────────────────────────────────────────────────────────────────────────────────

const fetchUserOnServer = createServerFn().handler(async (): Promise<User> => {
  const res = await fetch(`${API_BASE}/users/1?delay=300`)
  const data = await res.json()
  // Could filter sensitive fields here
  return data.data
})

const fetchPostsOnServer = createServerFn().handler(async (): Promise<Post[]> => {
  const res = await fetch(`${API_BASE}/users/1/posts?delay=800`)
  const data = await res.json()
  return data.data
})

const fetchStatsOnServer = createServerFn().handler(async (): Promise<{
  totalLogins: number
  documentsCreated: number
  apiCallsThisMonth: number
}> => {
  const res = await fetch(`${API_BASE}/users/1/stats?delay=1500`)
  const data = await res.json()
  return data.data
})

const fetchRecommendationsOnServer = createServerFn().handler(async (): Promise<{
  id: number
  title: string
  match: number
}[]> => {
  // Simulate slow recommendations API
  await new Promise(resolve => setTimeout(resolve, 2500))
  return [
    { id: 1, title: 'Advanced TypeScript Patterns', match: 95 },
    { id: 2, title: 'React Performance Deep Dive', match: 88 },
    { id: 3, title: 'Building Design Systems', match: 82 },
  ]
})

// ─────────────────────────────────────────────────────────────────────────────────
// Query Options (React Query configuration)
// ─────────────────────────────────────────────────────────────────────────────────

const streamingUserOptions = queryOptions({
  queryKey: ['streaming', 'user'],
  queryFn: () => fetchUserOnServer(),
  staleTime: 1000 * 60 * 5, // 5 minutes
})

const streamingPostsOptions = queryOptions({
  queryKey: ['streaming', 'posts'],
  queryFn: () => fetchPostsOnServer(),
  staleTime: 1000 * 60 * 5,
})

const streamingStatsOptions = queryOptions({
  queryKey: ['streaming', 'stats'],
  queryFn: () => fetchStatsOnServer(),
  staleTime: 1000 * 60 * 5,
})

const streamingRecommendationsOptions = queryOptions({
  queryKey: ['streaming', 'recommendations'],
  queryFn: () => fetchRecommendationsOnServer(),
  staleTime: 1000 * 60 * 5,
})

// ─────────────────────────────────────────────────────────────────────────────────
// Route
// ─────────────────────────────────────────────────────────────────────────────────

export const Route = createFileRoute('/streaming/deferred')({
  pendingComponent: () => (
    <div className="pending-indicator">
      <div className="pending-spinner" />
      <span>Loading critical data... (300ms)</span>
    </div>
  ),

  loader: async ({ context }) => {
    const { queryClient } = context
    const startTime = Date.now()

    // CRITICAL: Await user data - blocks navigation, cached by React Query
    const user = await queryClient.ensureQueryData(streamingUserOptions)

    const criticalTime = Date.now() - startTime

    // DEFERRED: Stream in later - cached by React Query
    // The defer() wraps the promise, data streams through HTML as it resolves
    const posts = defer(queryClient.ensureQueryData(streamingPostsOptions))


    const stats = defer(queryClient.ensureQueryData(streamingStatsOptions))
    const recommendations = defer(queryClient.ensureQueryData(streamingRecommendationsOptions))

    return { user, posts, stats, recommendations, criticalTime }
  },

  component: DeferredPage,
})

function DeferredPage() {
  const { user, posts, stats, recommendations, criticalTime } = Route.useLoaderData()

  return (
    <div>
      {/* Timing info */}
      <div style={{
        background: 'var(--success-bg)',
        border: '1px solid var(--success)',
        borderRadius: '8px',
        padding: '1rem',
        marginBottom: '1.5rem'
      }}>
        <strong style={{ color: 'var(--success)' }}>Initial render: {criticalTime}ms</strong>
        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          User profile appeared immediately. Other sections stream in as data resolves.
          <strong> Data is cached by React Query</strong> — navigate away and back to see instant load.
        </p>
      </div>

      {/* Dashboard grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {/* User Profile - IMMEDIATE */}
        <div className="workspace" style={{ borderColor: 'var(--success)' }}>
          <h3>
            User Profile <span style={{ color: 'var(--success)', fontWeight: 400 }}>(immediate)</span>
          </h3>
          <UserCard user={user} />
        </div>

        {/* Activity Stats - DEFERRED */}
        <div className="workspace">
          <h3>Activity Stats <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(~1500ms)</span></h3>
          <Suspense fallback={<Skeleton count={1} height={80} />}>
            <Await promise={stats}>
              {(statsData) => (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                  <div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--accent-light)' }}>
                      {statsData.totalLogins}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Logins</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--accent-light)' }}>
                      {statsData.documentsCreated}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Documents</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--accent-light)' }}>
                      {statsData.apiCallsThisMonth}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>API Calls</div>
                  </div>
                </div>
              )}
            </Await>
          </Suspense>
        </div>

        {/* Posts - DEFERRED */}
        <div className="workspace">
          <h3>Recent Posts <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(~800ms)</span></h3>
          <Suspense fallback={<Skeleton count={2} height={60} />}>
            <Await promise={posts}>
              {(postsData) => (
                <>
                  {postsData.slice(0, 2).map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </>
              )}
            </Await>
          </Suspense>
        </div>

        {/* Recommendations - DEFERRED (slowest) */}
        <div className="workspace">
          <h3>Recommendations <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(~2500ms)</span></h3>
          <Suspense fallback={<Skeleton count={3} height={50} />}>
            <Await promise={recommendations}>
              {(recsData) => (
                <>
                  {recsData.map((rec) => (
                    <div key={rec.id} style={{
                      padding: '0.75rem',
                      background: 'var(--bg-tertiary)',
                      borderRadius: '6px',
                      marginBottom: '0.5rem'
                    }}>
                      <div style={{ fontWeight: 500 }}>{rec.title}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--success)' }}>{rec.match}% match</div>
                    </div>
                  ))}
                </>
              )}
            </Await>
          </Suspense>
        </div>
      </div>
    </div>
  )
}
