import type { Composition } from '../../api'
import { cn } from '../../lib/utils'
import { Badge } from '../ui/Badge'
import { PatientAvatar } from '../patient/PatientAvatar'
import { getPatientDisplayName } from '../patient/PatientCard'

type UnfinishedNoteCardProps = {
  note: Composition
  onClick?: () => void
  className?: string
}

function formatDate(dateString?: string | null): string {
  if (!dateString) return ''
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  } catch {
    return dateString
  }
}

function formatTime(dateString?: string | null): string {
  if (!dateString) return ''
  try {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  } catch {
    return dateString
  }
}

function getStatusVariant(status?: string): 'default' | 'success' | 'warning' | 'error' | 'info' {
  switch (status) {
    case 'DRAFT':
    case 'draft':
      return 'warning'
    case 'IN_PROGRESS':
    case 'in-progress':
      return 'info'
    default:
      return 'default'
  }
}

export function UnfinishedNoteCard({ note, onClick, className }: UnfinishedNoteCardProps) {
  const Component = onClick ? 'button' : 'div'
  const patient = note.metadata?.patient
  const patientName = getPatientDisplayName(patient)

  return (
    <Component
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={cn(
        'flex w-full items-start gap-3 rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] p-4 text-left',
        onClick && 'cursor-pointer transition hover:border-[var(--lagoon)] hover:shadow-md',
        className
      )}
    >
      <PatientAvatar patient={patient} size="md" />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="truncate text-sm font-semibold text-[var(--sea-ink)]">
            {patientName}
          </h3>
          {note.metadata?.status && (
            <Badge variant={getStatusVariant(note.metadata.status)}>{note.metadata.status}</Badge>
          )}
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-[var(--sea-ink-soft)]">
          {note.metadata?.name && <span>{note.metadata.name}</span>}
          {note.metadata?.appointment?.startsAt && (
            <span>Appt: {formatDate(note.metadata.appointment.startsAt)}</span>
          )}
          {note.createdAt && <span>Created: {formatDate(note.createdAt)}</span>}
        </div>
        {note.updatedAt && (
          <p className="mt-1 text-xs text-[var(--sea-ink-soft)]">
            Last edited: {formatDate(note.updatedAt)} at {formatTime(note.updatedAt)}
          </p>
        )}
      </div>
    </Component>
  )
}

export function UnfinishedNoteCardCompact({ note, onClick, className }: UnfinishedNoteCardProps) {
  const patient = note.metadata?.patient
  const patientName = getPatientDisplayName(patient)

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-2 rounded-lg p-2 text-left transition hover:bg-[var(--surface)]',
        className
      )}
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-[var(--sea-ink)]">
          {patientName}
        </p>
        {note.metadata?.name && (
          <p className="text-xs text-[var(--sea-ink-soft)]">{note.metadata.name}</p>
        )}
      </div>
    </button>
  )
}
