import { Suspense } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { UserCard, PostCard, Skeleton } from '../../components'
import { useUserSuspense, useUserPostsSuspense } from '../../hooks'

interface DemoSuspenseSearch {
  userId?: number
}

export const Route = createFileRoute('/demo/suspense')({
  component: DemoSuspensePage,
  validateSearch: (search: Record<string, unknown>): DemoSuspenseSearch => {
    return {
      userId: typeof search.userId === 'number' ? search.userId : 1,
    }
  },
})

// ═══════════════════════════════════════════════════════════════════════════
// Suspense with SIBLING boundaries — parallel fetching!
// This is the "good" Suspense pattern from session 04.
// User and Posts fetch in parallel, but you STILL see skeletons.
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

function DemoSuspensePage() {
  const { userId = 1 } = Route.useSearch()

  return (
    <div>
      {/* Instructions */}
      <div className="insight-box" style={{ marginBottom: '1.5rem' }}>
        <h3>Open the Network tab</h3>
        <p>
          User and Posts fetch <strong>in parallel</strong> (sibling Suspense boundaries).
          Total ~800ms. But watch the UI — you see skeletons, then content pops in.
        </p>
      </div>

      {/* Rendered Content - SIBLING Suspense boundaries for parallel fetching */}
      <div className="workspace">
        <h3>Rendered Content</h3>
        {/* User and Posts are SIBLINGS - they fetch in parallel! */}
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
