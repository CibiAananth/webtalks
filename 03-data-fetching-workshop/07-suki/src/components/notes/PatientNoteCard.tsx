import type { PatientNote } from '../../api'
import { cn } from '../../lib/utils'
import { Badge } from '../ui/Badge'

type PatientNoteCardProps = {
  note: PatientNote
  onClick?: () => void
  className?: string
}

function formatDate(dateString?: string): string {
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

function getStatusVariant(status?: string): 'default' | 'success' | 'warning' | 'error' | 'info' {
  switch (status) {
    case 'signed':
      return 'success'
    case 'draft':
      return 'warning'
    default:
      return 'default'
  }
}

export function PatientNoteCard({ note, onClick, className }: PatientNoteCardProps) {
  const Component = onClick ? 'button' : 'div'

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
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--surface)]">
        <svg
          className="h-5 w-5 text-[var(--sea-ink-soft)]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold text-[var(--sea-ink)]">
            {note.noteType || 'Clinical Note'}
          </h3>
          {note.status && (
            <Badge variant={getStatusVariant(note.status)}>{note.status}</Badge>
          )}
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-[var(--sea-ink-soft)]">
          {note.createdAt && <span>Created: {formatDate(note.createdAt)}</span>}
          {note.signedAt && <span>Signed: {formatDate(note.signedAt)}</span>}
        </div>
      </div>
    </Component>
  )
}

export function PatientNoteCardCompact({ note, onClick, className }: PatientNoteCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-2 rounded-lg p-2 text-left transition hover:bg-[var(--surface)]',
        className
      )}
    >
      <div
        className={cn(
          'flex h-8 w-8 items-center justify-center rounded-full',
          note.status === 'signed'
            ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
            : 'bg-[var(--surface)] text-[var(--sea-ink-soft)]'
        )}
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-[var(--sea-ink)]">
          {note.noteType || 'Clinical Note'}
        </p>
        {note.createdAt && (
          <p className="text-xs text-[var(--sea-ink-soft)]">{formatDate(note.createdAt)}</p>
        )}
      </div>
      {note.status && (
        <Badge variant={getStatusVariant(note.status)} className="text-[10px]">
          {note.status}
        </Badge>
      )}
    </button>
  )
}
