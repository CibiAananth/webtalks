import { Suspense } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { UserCard, PostCard, Skeleton } from '../../components'
import { useUserSuspense, useUserPostsSuspense } from '../../hooks'
import { userQueryOptions, userPostsQueryOptions } from '../../api'

interface DemoLoaderSearch {
  userId?: number
}

export const Route = createFileRoute('/demo/with-loader')({
  validateSearch: (search: Record<string, unknown>): DemoLoaderSearch => {
    return {
      userId: typeof search.userId === 'number' ? search.userId : 1,
    }
  },

  // ════════════════════════════════════════════════════════════════════════
  // THE ROUTE LOADER
  // This runs BEFORE the component renders.
  // We prefetch user and posts IN PARALLEL using Promise.all
  // ════════════════════════════════════════════════════════════════════════
  loader: async ({ context, location }) => {
    const userId = (location.search as DemoLoaderSearch).userId ?? 1

    // Fetch BOTH in parallel using Promise.all
    const [user, posts] = await Promise.all([
      context.queryClient.ensureQueryData(userQueryOptions(userId)),
      context.queryClient.ensureQueryData(userPostsQueryOptions(userId)),
    ])

    return { user, posts }
  },

  component: DemoLoaderPage,
})

// ═══════════════════════════════════════════════════════════════════════════
// Components - SAME structure as Suspense version
// But data is already in cache, so no suspension occurs!
// ═══════════════════════════════════════════════════════════════════════════

function UserInfo({ userId }: { userId: number }) {
  const { data: user } = useUserSuspense(userId)
  return <UserCard user={user} />
}

function UserPosts({ userId }: { userId: number }) {
  const { data: posts } = useUserPostsSuspense(userId)

  if (posts.length === 0) return null

  return (
    <div style={{ marginTop: '1rem' }}>
      <h3 style={{ marginBottom: '0.75rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
        Posts
      </h3>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// Main Page Component
// ═══════════════════════════════════════════════════════════════════════════

function DemoLoaderPage() {
  const { userId = 1 } = Route.useSearch()

  return (
    <div>
      {/* Instructions */}
      <div className="insight-box success" style={{ marginBottom: '1.5rem' }}>
        <h3>Open the Network tab</h3>
        <p>
          Same parallel fetches (~800ms total). But watch the UI — <strong>no skeletons!</strong>{' '}
          The page appears complete because data was fetched BEFORE rendering.
        </p>
      </div>

      {/* Rendered Content - same structure, but data is pre-cached */}
      <div className="workspace solution">
        <h3>Rendered Content (from cache)</h3>
        {/* Same sibling structure as Suspense version */}
        <Suspense fallback={<Skeleton count={1} height={80} />}>
          <UserInfo key={`user-${userId}`} userId={userId} />
        </Suspense>
        <Suspense fallback={<Skeleton count={2} height={60} />}>
          <UserPosts key={`posts-${userId}`} userId={userId} />
        </Suspense>
      </div>
    </div>
  )
}
