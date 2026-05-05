import type { Composition } from '../../api'
import { cn } from '../../lib/utils'
import { EmptyState } from '../ui/EmptyState'
import { UnfinishedNoteCard, UnfinishedNoteCardCompact } from './UnfinishedNoteCard'

type UnfinishedNotesListProps = {
  notes: Composition[]
  onNoteClick?: (note: Composition) => void
  compact?: boolean
  className?: string
}

export function UnfinishedNotesList({
  notes,
  onNoteClick,
  compact = false,
  className,
}: UnfinishedNotesListProps) {
  if (notes.length === 0) {
    return (
      <EmptyState
        title="No unfinished notes"
        description="All notes have been completed."
        icon={
          <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        }
      />
    )
  }

  const CardComponent = compact ? UnfinishedNoteCardCompact : UnfinishedNoteCard

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
