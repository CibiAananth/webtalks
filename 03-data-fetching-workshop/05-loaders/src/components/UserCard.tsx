import type { User } from '../types'

interface UserCardProps {
  user: User
  onClick?: () => void
}

export default function UserCard({ user, onClick }: UserCardProps) {
  const className = onClick ? 'user-card clickable' : 'user-card'

  return (
    <div className={className} onClick={onClick}>
      <img className="user-avatar" src={user.avatar} alt={user.name} />
      <div className="user-details">
        <h3>{user.name}</h3>
        <div className="meta">{user.email}</div>
        <span className="badge">{user.role}</span>
      </div>
    </div>
  )
}
