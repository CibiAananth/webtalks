import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { UserCard, PostCard, CommentCard, Skeleton } from '../../components'
import { useUser, useUsers, useUserPosts, usePostComments } from '../../hooks'

// ════════════════════════════════════════════════════════════════════════════════
// EXERCISE: Add a loader to this route
//
// Currently: NO loader — components fetch their own data → waterfall (~2400ms)
// Goal: Add a loader that prefetches data → parallel fetches (~1600ms)
//
// STEP 1: Import the query options from '../../api':
//   import { userQueryOptions, usersQueryOptions, userPostsQueryOptions, postCommentsQueryOptions } from '../../api'
//
// STEP 2: Add a loader function to the route config below
//
// STEP 3: In the loader:
//   - Phase 1: Use Promise.all to fetch user, posts, and members in parallel
//   - Phase 2: After posts resolve, fetch comments (needs posts[0].id)
//
// See the solution route for the complete implementation.
// ════════════════════════════════════════════════════════════════════════════════

export const Route = createFileRoute('/exercise/users/$userId')({
  component: ProfilePage,

  // ══════════════════════════════════════════════════════════════════════════
  // ADD YOUR LOADER HERE
  // ══════════════════════════════════════════════════════════════════════════
  // loader: async ({ context, params }) => {
  //   const userId = parseInt(params.userId, 10)
  //
  //   // Phase 1: Fetch user, posts, and members in parallel
  //   const [user, posts, users] = await Promise.all([
  //     context.queryClient.ensureQueryData(userQueryOptions(userId)),
  //     context.queryClient.ensureQueryData(userPostsQueryOptions(userId)),
  //     context.queryClient.ensureQueryData(usersQueryOptions()),
  //   ])
  //
  //   // Phase 2: Fetch comments (depends on posts)
  //   if (posts.length > 0) {
  //     await context.queryClient.ensureQueryData(
  //       postCommentsQueryOptions(posts[0].id)
  //     )
  //   }
  // },
  // ══════════════════════════════════════════════════════════════════════════
})

// ═══════════════════════════════════════════════════════════════════════════
// Profile Page — The Problem (no loader = waterfall)
// ═══════════════════════════════════════════════════════════════════════════

function ProfilePage() {
  const { userId } = Route.useParams()
  const userIdNum = parseInt(userId, 10)
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const handleUserChange = (newUserId: number) => {
    queryClient.clear()
    navigate({ to: '/exercise/users/$userId', params: { userId: String(newUserId) } })
  }

  return (
    <>
      <div className="section-header">
        <h1>
          <span className="accent">Profile</span> (Problem — Fix This!)
        </h1>
        <Link
          to="/exercise/users/$userId/solution"
          params={{ userId }}
          className="btn-ghost btn-small"
        >
          ← View Solution
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

      {/* The Problem */}
      <div className="insight-box warning" style={{ marginBottom: '1.5rem' }}>
        <h3>Open the Network tab and observe:</h3>
        <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
          <li>user and members start together (siblings — good!)</li>
          <li>posts waits for user (nested component — bad!)</li>
          <li>comments waits for posts (data dependency — unavoidable)</li>
          <li><strong>Total: ~2400ms</strong> — with visible skeleton flashing</li>
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

      {/* Your Task */}
      <div className="insight-box" style={{ marginTop: '2rem' }}>
        <h3>Your Task</h3>
        <p>
          Open <code>src/routes/exercise/users.$userId.tsx</code> and add a loader.
        </p>
        <ol style={{ marginTop: '0.75rem', paddingLeft: '1.5rem', display: 'grid', gap: '0.5rem' }}>
          <li>Import <code>userQueryOptions</code>, <code>usersQueryOptions</code>, <code>userPostsQueryOptions</code>, <code>postCommentsQueryOptions</code> from <code>'../../api'</code></li>
          <li>Add a <code>loader</code> function to the route config</li>
          <li>Phase 1: <code>Promise.all</code> for user, posts, and members</li>
          <li>Phase 2: Fetch comments using <code>posts[0].id</code></li>
        </ol>
      </div>

      {/* Hint */}
      <div className="insight-box" style={{ marginTop: '1rem', borderColor: 'var(--text-muted)' }}>
        <h3>Hint</h3>
        <p>
          The loader template is already in the file as a comment. Uncomment it and add the import!
        </p>
      </div>
    </>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// UserHeader - fetches user, then renders UserPosts as a child
// This nesting creates the waterfall: user must load before posts can start
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

// ═══════════════════════════════════════════════════════════════════════════
// UserPosts - fetches posts, then renders PostComments as a child
// ═══════════════════════════════════════════════════════════════════════════

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

// ═══════════════════════════════════════════════════════════════════════════
// PostComments - fetches comments (3rd level of waterfall)
// ═══════════════════════════════════════════════════════════════════════════

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

// ═══════════════════════════════════════════════════════════════════════════
// AllMembers - sidebar component (fetches independently)
// ═══════════════════════════════════════════════════════════════════════════

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
