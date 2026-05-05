import type { Patient } from '../../api'
import { cn } from '../../lib/utils'

type PatientAvatarProps = {
  patient?: Patient | null
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeStyles = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
}

function getInitials(patient?: Patient | null): string {
  if (!patient?.person) return '??'

  const { firstName, lastName, preferredName } = patient.person

  if (firstName && lastName) {
    return `${firstName[0]}${lastName[0]}`.toUpperCase()
  }
  if (preferredName) {
    const parts = preferredName.split(' ')
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    }
    return preferredName.slice(0, 2).toUpperCase()
  }
  if (firstName) {
    return firstName.slice(0, 2).toUpperCase()
  }
  return '??'
}

export function PatientAvatar({
  patient,
  size = 'md',
  className,
}: PatientAvatarProps) {
  const initials = getInitials(patient)

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full bg-gradient-to-br from-[var(--palm)] to-[var(--lagoon-deep)] font-semibold text-white',
        sizeStyles[size],
        className
      )}
    >
      {initials}
    </div>
  )
}
