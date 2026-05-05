import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { UserCard, PostCard, Skeleton } from '../../components'
import type { Post } from '../../types'

// ════════════════════════════════════════════════════════════════════════════════
// SERVER FUNCTIONS DEMO
//
// This demonstrates when to use server functions:
// 1. API secrets - Auth tokens stay on server
// 2. Internal APIs - Call services not accessible from browser
// 3. Data filtering - Strip sensitive fields before sending to client
// 4. Aggregation - Combine multiple API calls into one response
// ════════════════════════════════════════════════════════════════════════════════

const API_BASE = 'http://localhost:3069/api'

// Imagine this is stored in environment variables on the server
const INTERNAL_API_KEY = 'sk_internal_9f8e7d6c5b4a3210'

interface UserWithStatsAndPosts {
  // Public fields only
  id: number
  name: string
  email: string
  role: string
  avatar: string
  joined: string
  // Aggregated stats (from internal API)
  stats: {
    totalLogins: number
    documentsCreated: number
    apiCallsThisMonth: number
  }
  posts: Post[]
}

// This function runs ONLY on the server
const getSecureUserWithStats = createServerFn().handler(async (ctx) => {
  const userId = ctx.data as number

  // ══════════════════════════════════════════════════════════════════════════
  // 1. AGGREGATION - Combine multiple API calls into one response
  // ══════════════════════════════════════════════════════════════════════════
  const [userRes, statsRes, postsRes] = await Promise.all([
    fetch(`${API_BASE}/users/${userId}?delay=300`),
    // 2. INTERNAL API - This endpoint might be on a private network
    //    The browser can't reach it, but our server can
    fetch(`${API_BASE}/users/${userId}/stats?delay=300`),
    fetch(`${API_BASE}/users/${userId}/posts?delay=300`),
  ])

  if (!userRes.ok || !statsRes.ok || !postsRes.ok) {
    throw new Error('Failed to fetch user data')
  }

  const userData = await userRes.json()
  const statsData = await statsRes.json()
  const postsData = await postsRes.json()
  const rawUser = userData.data
  const stats = statsData.data
  const posts = postsData.data

  // ══════════════════════════════════════════════════════════════════════════
  // 3. DATA FILTERING - Strip sensitive fields before sending to client
  // ══════════════════════════════════════════════════════════════════════════
  const secureUser: UserWithStatsAndPosts = {
    id: rawUser.id,
    name: rawUser.name,
    email: rawUser.email,
    role: rawUser.role,
    avatar: rawUser.avatar,
    joined: rawUser.joined,
    stats: stats,
    posts: posts,
    // NOTE: These fields exist in rawUser but we DON'T send them:
    // - stripeCustomerId
    // - lastLoginIp
    // - sessionToken
    // - internalDatabaseId
  }

  return secureUser
})

interface DemoSearch {
  userId?: number
}

export const Route = createFileRoute('/demo/server-fn')({
  validateSearch: (search: Record<string, unknown>): DemoSearch => {
    return {
      userId: typeof search.userId === 'number' ? search.userId : 1,
    }
  },

  loaderDeps: ({ search }) => ({ userId: search.userId }),

  pendingComponent: () => (
    <div className="pending-indicator">
      <div className="pending-spinner" />
      <span>Server is fetching...</span>
    </div>
  ),

  loader: async ({ deps }) => {
    const userId = deps.userId ?? 1
    return getSecureUserWithStats({ data: userId })
  },

  component: ServerFnPage,
})

function ServerFnPage() {
  const user = Route.useLoaderData()

  if (!user) {
    return <Skeleton count={1} height={120} />
  }

  return (
    <div className="workspace">
      <h3>User Profile</h3>
      <UserCard user={user} />

      {/* Stats */}
      <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: '8px' }}>
        <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Activity Stats
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--accent-light)' }}>
              {user.stats.totalLogins}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Logins</div>
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--accent-light)' }}>
              {user.stats.documentsCreated}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Documents</div>
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--accent-light)' }}>
              {user.stats.apiCallsThisMonth}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>API Calls</div>
          </div>
        </div>
      </div>

      {/* Posts */}
      {user.posts.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3 style={{ marginBottom: '0.75rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Posts
          </h3>
          {user.posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}
