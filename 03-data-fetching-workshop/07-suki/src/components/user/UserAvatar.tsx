import { cn } from '../../lib/utils'

type UserAvatarProps = {
  name?: string
  email?: string
  avatar?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeStyles = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-base',
}

function getInitials(name?: string, email?: string): string {
  if (name) {
    const parts = name.split(' ')
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    }
    return name.slice(0, 2).toUpperCase()
  }
  if (email) {
    return email.slice(0, 2).toUpperCase()
  }
  return '??'
}

export function UserAvatar({
  name,
  email,
  avatar,
  size = 'md',
  className,
}: UserAvatarProps) {
  const initials = getInitials(name, email)

  if (avatar) {
    return (
      <img
        src={avatar}
        alt={name || email || 'User avatar'}
        className={cn(
          'rounded-full object-cover',
          sizeStyles[size],
          className
        )}
      />
    )
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full bg-gradient-to-br from-[var(--lagoon)] to-[var(--lagoon-deep)] font-semibold text-white',
        sizeStyles[size],
        className
      )}
    >
      {initials}
    </div>
  )
}
