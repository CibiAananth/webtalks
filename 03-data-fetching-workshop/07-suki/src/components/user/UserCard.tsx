import type { User } from '../../api'
import { cn } from '../../lib/utils'
import { UserAvatar } from './UserAvatar'

type UserCardProps = {
  user: User
  className?: string
}

function getUserDisplayName(user: User): string {
  if (user.name) return user.name
  if (user.firstName && user.lastName) return `${user.firstName} ${user.lastName}`
  if (user.firstName) return user.firstName
  return user.email
}

export function UserCard({ user, className }: UserCardProps) {
  const displayName = getUserDisplayName(user)

  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] p-4',
        className
      )}
    >
      <UserAvatar name={displayName} email={user.email} avatar={user.avatar} size="lg" />
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-base font-semibold text-[var(--sea-ink)]">
          {displayName}
        </h3>
        <p className="truncate text-sm text-[var(--sea-ink-soft)]">{user.email}</p>
        {user.role && (
          <p className="mt-1 text-xs text-[var(--lagoon-deep)]">{user.role}</p>
        )}
      </div>
    </div>
  )
}

export function UserCardCompact({ user, className }: UserCardProps) {
  const displayName = getUserDisplayName(user)

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <UserAvatar name={displayName} email={user.email} avatar={user.avatar} size="sm" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-[var(--sea-ink)]">
          {displayName}
        </p>
      </div>
    </div>
  )
}
