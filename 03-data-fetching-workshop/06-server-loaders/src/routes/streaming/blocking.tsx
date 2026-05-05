import { createFileRoute } from '@tanstack/react-router'
import { queryOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { UserCard, PostCard, Skeleton } from '../../components'
import type { User, Post } from '../../types'

const API_BASE = 'http://localhost:3069/api'

// ════════════════════════════════════════════════════════════════════════════════
// BLOCKING + REACT QUERY + SERVER FUNCTIONS
//
// All data is awaited before the page renders.
// User waits for the SLOWEST request (2500ms) before seeing ANYTHING.
// Data is still cached by React Query.
// ════════════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────────
// Server Functions (run on server only)
// ─────────────────────────────────────────────────────────────────────────────────

const fetchUserOnServer = createServerFn().handler(async (): Promise<User> => {
  const res = await fetch(`${API_BASE}/users/1?delay=300`)
  const data = await res.json()
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

const blockingUserOptions = queryOptions({
  queryKey: ['blocking', 'user'],
  queryFn: () => fetchUserOnServer(),
  staleTime: 1000 * 60 * 5,
})

const blockingPostsOptions = queryOptions({
  queryKey: ['blocking', 'posts'],
  queryFn: () => fetchPostsOnServer(),
  staleTime: 1000 * 60 * 5,
})

const blockingStatsOptions = queryOptions({
  queryKey: ['blocking', 'stats'],
  queryFn: () => fetchStatsOnServer(),
  staleTime: 1000 * 60 * 5,
})

const blockingRecommendationsOptions = queryOptions({
  queryKey: ['blocking', 'recommendations'],
  queryFn: () => fetchRecommendationsOnServer(),
  staleTime: 1000 * 60 * 5,
})

// ─────────────────────────────────────────────────────────────────────────────────
// Route
// ─────────────────────────────────────────────────────────────────────────────────

export const Route = createFileRoute('/streaming/blocking')({
  pendingComponent: () => (
    <div className="pending-indicator">
      <div className="pending-spinner" />
      <span>Waiting for ALL data... (~2.5 seconds)</span>
    </div>
  ),

  loader: async ({ context }) => {
    const { queryClient } = context
    const startTime = Date.now()

    // BLOCKING: Wait for ALL data before rendering
    const [user, posts, stats, recommendations] = await Promise.all([
      queryClient.ensureQueryData(blockingUserOptions),
      queryClient.ensureQueryData(blockingPostsOptions),
      queryClient.ensureQueryData(blockingStatsOptions),
      queryClient.ensureQueryData(blockingRecommendationsOptions),
    ])

    const loadTime = Date.now() - startTime

    return { user, posts, stats, recommendations, loadTime }
  },

  component: BlockingPage,
})

function BlockingPage() {
  const { user, posts, stats, recommendations, loadTime } = Route.useLoaderData()

  return (
    <div>
      {/* Timing info */}
      <div style={{
        background: 'rgba(239, 68, 68, 0.1)',
        border: '1px solid var(--error)',
        borderRadius: '8px',
        padding: '1rem',
        marginBottom: '1.5rem'
      }}>
        <strong style={{ color: 'var(--error)' }}>Total wait time: {loadTime}ms</strong>
        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          You saw nothing until ALL requests completed. The 300ms user data was ready,
          but you waited for the 2500ms recommendations.
          <strong> Data is cached</strong> — navigate away and back to see instant load.
        </p>
      </div>

      {/* Dashboard grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {/* User Profile */}
        <div className="workspace">
          <h3>User Profile <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(300ms)</span></h3>
          <UserCard user={user} />
        </div>

        {/* Activity Stats */}
        <div className="workspace">
          <h3>Activity Stats <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(1500ms)</span></h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--accent-light)' }}>
                {stats.totalLogins}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Logins</div>
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--accent-light)' }}>
                {stats.documentsCreated}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Documents</div>
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--accent-light)' }}>
                {stats.apiCallsThisMonth}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>API Calls</div>
            </div>
          </div>
        </div>

        {/* Posts */}
        <div className="workspace">
          <h3>Recent Posts <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(800ms)</span></h3>
          {posts.slice(0, 2).map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>

        {/* Recommendations */}
        <div className="workspace">
          <h3>Recommendations <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(2500ms)</span></h3>
          {recommendations.map((rec) => (
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
        </div>
      </div>
    </div>
  )
}
