import { createFileRoute, Link } from '@tanstack/react-router'
import { UserCard, Skeleton } from '../../components'
import { useUsers } from '../../hooks'

export const Route = createFileRoute('/exercise/')({
  component: ExerciseIndex,
})

function ExerciseIndex() {
  const { data: users, isLoading } = useUsers()

  return (
    <>
      <h1>
        <span className="accent">Part 2:</span> Add a Route Loader
      </h1>
      <p className="description">
        A user profile page with nested data fetching. Your task: add a loader to eliminate the waterfall.
      </p>

      {/* Exercise Flow */}
      <div className="instruction-card">
        <h2>Exercise Flow</h2>
        <ol style={{ marginTop: '0.75rem', paddingLeft: '1.5rem', display: 'grid', gap: '0.5rem' }}>
          <li>
            <strong>First:</strong> Click a user below, then click <strong>"View Solution"</strong> to see the goal
          </li>
          <li>
            <strong>Then:</strong> Click <strong>"View Problem"</strong> to see the current (slow) version
          </li>
          <li>
            <strong>Finally:</strong> Open <code>src/routes/exercise/users.$userId.tsx</code> and add a loader
          </li>
        </ol>
      </div>

      {/* What You'll Learn */}
      <div className="insight-box" style={{ marginTop: '1.5rem' }}>
        <h3>What you'll implement</h3>
        <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem', display: 'grid', gap: '0.25rem' }}>
          <li>A route loader that prefetches data before components render</li>
          <li>Phase 1: user, posts, and members in parallel (<code>Promise.all</code>)</li>
          <li>Phase 2: comments after posts (needs first post ID)</li>
          <li>Result: ~1600ms instead of ~2400ms</li>
        </ul>
      </div>

      {/* User Grid */}
      <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Select a user to begin:</h3>
      {isLoading ? (
        <Skeleton count={5} height={80} />
      ) : (
        <div className="users-grid">
          {users?.map((user) => (
            <Link key={user.id} to="/exercise/users/$userId/solution" params={{ userId: String(user.id) }}>
              <UserCard user={user} />
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
