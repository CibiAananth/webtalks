import { clsx, type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function getDisplayName(person?: { firstName?: string; lastName?: string } | null): string {
  if (!person) return 'Unknown'
  const parts = [person.firstName, person.lastName].filter(Boolean)
  return parts.length > 0 ? parts.join(' ') : 'Unknown'
}

export function formatTime(isoString?: string): string {
  if (!isoString) return ''
  return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export function formatDate(isoString?: string): string {
  if (!isoString) return ''
  return new Date(isoString).toLocaleDateString()
}

export function getRelativeTime(isoString?: string | null): string {
  if (!isoString) return ''
  const diff = Date.now() - new Date(isoString).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}
