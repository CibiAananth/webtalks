import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { UserCard, PostCard, CommentCard, Skeleton } from '../../components'
import { useUser, useUsers, useUserPosts, usePostComments } from '../../hooks'
import {
  userQueryOptions,
  usersQueryOptions,
  userPostsQueryOptions,
  postCommentsQueryOptions,
} from '../../api'

// ════════════════════════════════════════════════════════════════════════════
// SOLUTION: This is what you're building.
// The loader prefetches all data before components render.
// ════════════════════════════════════════════════════════════════════════════

export const Route = createFileRoute('/exercise/users_/$userId/solution')({
  // Show a pending indicator while the loader runs
  pendingComponent: PendingIndicator,
  pendingMs: 0,
  pendingMinMs: 200,

  // ════════════════════════════════════════════════════════════════════════
  // THE ROUTE LOADER — This is what you need to add to the problem file
  // ════════════════════════════════════════════════════════════════════════
  loader: async ({ context, params }) => {
    const userId = parseInt(params.userId, 10)

    // PHASE 1: Fetch user, posts, and members IN PARALLEL
    // These have no dependencies on each other
    const [user, posts, users] = await Promise.all([
      context.queryClient.ensureQueryData(userQueryOptions(userId)),
      context.queryClient.ensureQueryData(userPostsQueryOptions(userId)),
      context.queryClient.ensureQueryData(usersQueryOptions()),
    ])

    // PHASE 2: Fetch comments AFTER posts
    // We need posts[0].id — this is a real data dependency
    let comments = null
    if (posts.length > 0) {
      const firstPostId = posts[0]!.id
      comments = await context.queryClient.ensureQueryData(
        postCommentsQueryOptions(firstPostId)
      )
    }

    return { user, posts, users, comments }
  },

  component: ProfilePageSolution,
})

function PendingIndicator() {
  return (
    <div className="pending-indicator">
      <div className="pending-spinner" />
      <span>Loading profile...</span>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// Profile Page — The Goal
// ═══════════════════════════════════════════════════════════════════════════

function ProfilePageSolution() {
  const { userId } = Route.useParams()
  const userIdNum = parseInt(userId, 10)
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const handleUserChange = (newUserId: number) => {
    queryClient.clear()
    navigate({
      to: '/exercise/users/$userId/solution',
      params: { userId: String(newUserId) },
    })
  }

  return (
    <>
      <div className="section-header">
        <h1>
          <span className="accent">Profile</span> (Solution — The Goal)
        </h1>
        <Link
          to="/exercise/users/$userId"
          params={{ userId }}
          className="btn-ghost btn-small"
        >
          View Problem →
        </Link>
      </div>

      {/* User selector */}
      <div style={{ marginBottom: '1.5rem' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginRight: '0.75rem' }}>
          Select user:
        </span>
        <div className="user-selector" style={{ display: 'inline-flex' }}>
          {[1, 2, 3, 4, 5].map((id) => (
            <button
              key={id}
              className={userIdNum === id ? 'active' : ''}
              onClick={() => handleUserChange(id)}
            >
              User {id}
            </button>
          ))}
        </div>
      </div>

      {/* What to observe */}
      <div className="insight-box success" style={{ marginBottom: '1.5rem' }}>
        <h3>Open the Network tab and observe:</h3>
        <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
          <li><strong>Phase 1 (~800ms):</strong> user, posts, and members start together (parallel)</li>
          <li><strong>Phase 2 (~800ms):</strong> comments starts after posts complete</li>
          <li><strong>Total: ~1600ms</strong> — and NO skeleton flash!</li>
        </ul>
      </div>

      {/* Dashboard Layout */}
      <div className="dashboard-layout">
        <div className="dashboard-main">
          <UserHeader key={userIdNum} userId={userIdNum} />
        </div>
        <div className="dashboard-sidebar">
          <AllMembers />
        </div>
      </div>

      {/* The Loader Code */}
      <div className="insight-box" style={{ marginTop: '2rem' }}>
        <h3>The loader you'll write:</h3>
        <pre style={{
          marginTop: '0.75rem',
          padding: '1rem',
          background: 'var(--bg)',
          borderRadius: '4px',
          overflow: 'auto',
          fontSize: '0.85rem'
        }}>
{`loader: async ({ context, params }) => {
  const userId = parseInt(params.userId, 10)

  // Phase 1: Parallel fetches
  const [user, posts, users] = await Promise.all([
    context.queryClient.ensureQueryData(userQueryOptions(userId)),
    context.queryClient.ensureQueryData(userPostsQueryOptions(userId)),
    context.queryClient.ensureQueryData(usersQueryOptions()),
  ])

  // Phase 2: Dependent fetch
  if (posts.length > 0) {
    await context.queryClient.ensureQueryData(
      postCommentsQueryOptions(posts[0].id)
    )
  }
}`}
        </pre>
      </div>

      {/* Next step */}
      <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
        <Link
          to="/exercise/users/$userId"
          params={{ userId }}
          className="btn-primary"
          style={{ display: 'inline-block', padding: '0.75rem 1.5rem' }}
        >
          Now see the problem version →
        </Link>
      </div>
    </>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// Components — identical structure, but data is pre-cached
// ═══════════════════════════════════════════════════════════════════════════

function UserHeader({ userId }: { userId: number }) {
  const { data: user, isLoading } = useUser(userId)

  if (isLoading) {
    return <Skeleton count={1} height={80} />
  }

  if (!user) return null

  return (
    <div>
      <UserCard user={user} />
      <UserPosts userId={userId} />
    </div>
  )
}

function UserPosts({ userId }: { userId: number }) {
  const { data: posts, isLoading } = useUserPosts(userId)

  if (isLoading) {
    return (
      <div style={{ marginTop: '1.5rem' }}>
        <Skeleton count={2} height={80} />
      </div>
    )
  }

  if (!posts || posts.length === 0) return null

  const firstPost = posts[0]!

  return (
    <div style={{ marginTop: '1.5rem' }}>
      <h3 style={{ marginBottom: '0.75rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
        Recent Posts
      </h3>
      {posts.map((post, index) => (
        <div key={post.id}>
          <PostCard post={post} />
          {index === 0 && <PostComments postId={firstPost.id} />}
        </div>
      ))}
    </div>
  )
}

function PostComments({ postId }: { postId: number }) {
  const { data: comments, isLoading } = usePostComments(postId)

  if (isLoading) {
    return (
      <div style={{ marginTop: '0.75rem', paddingLeft: '1rem', borderLeft: '2px solid var(--border)' }}>
        <Skeleton count={2} height={50} />
      </div>
    )
  }

  if (!comments || comments.length === 0) return null

  return (
    <div style={{ marginTop: '0.75rem', paddingLeft: '1rem', borderLeft: '2px solid var(--border)' }}>
      <h4 style={{ marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        Comments
      </h4>
      {comments.map((comment) => (
        <CommentCard key={comment.id} comment={comment} />
      ))}
    </div>
  )
}

function AllMembers() {
  const { data: users, isLoading } = useUsers()

  if (isLoading) {
    return (
      <div className="sidebar-card">
        <h3>Team Members</h3>
        <Skeleton count={5} height={40} />
      </div>
    )
  }

  if (!users) return null

  return (
    <div className="sidebar-card">
      <h3>Team Members</h3>
      <div className="member-list">
        {users.map((user) => (
          <div key={user.id} className="member-item">
            <img src={user.avatar} alt={user.name} />
            <div>
              <div className="name">{user.name}</div>
              <div className="role">{user.role}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
