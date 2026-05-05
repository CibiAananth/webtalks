import { Suspense } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { UserCard, PostCard, Skeleton } from '../../components'
import { useUserSuspense, useUserPostsSuspense } from '../../hooks'
import { userQueryOptions, userPostsQueryOptions } from '../../api'

interface ProfileSearch {
  userId?: number
}

export const Route = createFileRoute('/demo/profile')({
  validateSearch: (search: Record<string, unknown>): ProfileSearch => {
    return {
      userId: typeof search.userId === 'number' ? search.userId : 1,
    }
  },

  loader: async ({ context, location }) => {
    const userId = (location.search as ProfileSearch).userId ?? 1

    const [user, posts] = await Promise.all([
      context.queryClient.ensureQueryData(userQueryOptions(userId)),
      context.queryClient.ensureQueryData(userPostsQueryOptions(userId)),
    ])

    return { user, posts }
  },

  component: ProfilePage,
})

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

function ProfilePage() {
  const { userId = 1 } = Route.useSearch()

  return (
    <div className="workspace">
      <h3>User Profile</h3>
      <Suspense fallback={<Skeleton count={1} height={80} />}>
        <UserInfo key={`user-${userId}`} userId={userId} />
      </Suspense>
      <Suspense fallback={<Skeleton count={2} height={60} />}>
        <UserPosts key={`posts-${userId}`} userId={userId} />
      </Suspense>
    </div>
  )
}
