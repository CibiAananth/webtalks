import type { PatientNote } from '../../api'
import { cn } from '../../lib/utils'
import { EmptyState } from '../ui/EmptyState'
import { PatientNoteCard, PatientNoteCardCompact } from './PatientNoteCard'

type PatientNotesListProps = {
  notes: PatientNote[]
  onNoteClick?: (note: PatientNote) => void
  compact?: boolean
  className?: string
}

export function PatientNotesList({
  notes,
  onNoteClick,
  compact = false,
  className,
}: PatientNotesListProps) {
  if (notes.length === 0) {
    return (
      <EmptyState
        title="No notes found"
        description="There are no notes for this patient."
        icon={
          <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        }
      />
    )
  }

  const CardComponent = compact ? PatientNoteCardCompact : PatientNoteCard

  return (
    <div className={cn('space-y-2', className)}>
      {notes.map((note) => (
        <CardComponent
          key={note.id}
          note={note}
          onClick={onNoteClick ? () => onNoteClick(note) : undefined}
        />
      ))}
    </div>
  )
}
