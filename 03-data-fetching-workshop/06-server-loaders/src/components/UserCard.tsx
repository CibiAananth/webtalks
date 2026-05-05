import type { User } from '../types'

export function UserCard({ user }: { user: User }) {
  return (
    <div className="user-card">
      <img src={user.avatar} alt={user.name} className="avatar" />
      <div className="info">
        <h3>{user.name}</h3>
        <p className="email">{user.email}</p>
        <span className="role">{user.role}</span>
      </div>
    </div>
  )
}
