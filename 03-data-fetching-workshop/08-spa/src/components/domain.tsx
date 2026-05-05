import type { User, Patient, Appointment, Composition, PatientNote } from '../api'
import { getDisplayName, formatTime, getRelativeTime, cn } from '../lib/utils'

// ════════════════════════════════════════════════════════════════════════════════
// USER COMPONENTS
// ════════════════════════════════════════════════════════════════════════════════

export function UserCard({ user }: { user: User }) {
  const displayName = user.firstName && user.lastName
    ? `${user.firstName} ${user.lastName}`
    : user.name ?? user.email

  return (
    <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--lagoon)] text-lg font-semibold text-white">
          {displayName.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-semibold text-[var(--sea-ink)]">{displayName}</p>
          <p className="text-sm text-[var(--sea-ink-soft)]">{user.email}</p>
          {user.role && (
            <span className="mt-1 inline-block rounded-full bg-[var(--chip-bg)] px-2 py-0.5 text-xs text-[var(--sea-ink-soft)]">
              {user.role}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════════
// APPOINTMENT COMPONENTS
// ════════════════════════════════════════════════════════════════════════════════

export function AppointmentList({
  appointments,
  onAppointmentClick,
}: {
  appointments: Appointment[]
  onAppointmentClick?: (apt: Appointment) => void
}) {
  if (appointments.length === 0) {
    return <p className="py-4 text-center text-sm text-[var(--sea-ink-soft)]">No appointments</p>
  }

  return (
    <div className="space-y-1">
      {appointments.map((apt) => (
        <AppointmentCard key={apt.id} appointment={apt} onClick={() => onAppointmentClick?.(apt)} />
      ))}
    </div>
  )
}

function AppointmentCard({ appointment, onClick }: { appointment: Appointment; onClick?: () => void }) {
  const patientName = getDisplayName(appointment.patient?.person)

  const statusColors: Record<string, string> = {
    completed: 'bg-emerald-100 text-emerald-700',
    'in-progress': 'bg-blue-100 text-blue-700',
    scheduled: 'bg-gray-100 text-gray-700',
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-lg p-2 text-left transition hover:bg-[var(--link-bg-hover)]"
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--seafoam)] text-xs font-medium text-[var(--sea-ink)]">
        {patientName.charAt(0)}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-[var(--sea-ink)]">{patientName}</p>
        <p className="text-xs text-[var(--sea-ink-soft)]">
          {formatTime(appointment.startsAt)} · {appointment.type}
        </p>
      </div>
      {appointment.status && (
        <span className={cn('rounded-full px-2 py-0.5 text-xs', statusColors[appointment.status] ?? statusColors.scheduled)}>
          {appointment.status}
        </span>
      )}
    </button>
  )
}

// ════════════════════════════════════════════════════════════════════════════════
// UNFINISHED NOTES COMPONENTS
// ════════════════════════════════════════════════════════════════════════════════

export function UnfinishedNotesList({
  notes,
  onNoteClick,
}: {
  notes: Composition[]
  onNoteClick?: (note: Composition) => void
}) {
  if (notes.length === 0) {
    return <p className="py-4 text-center text-sm text-[var(--sea-ink-soft)]">No unfinished notes</p>
  }

  return (
    <div className="space-y-1">
      {notes.map((note) => (
        <UnfinishedNoteCard key={note.id} note={note} onClick={() => onNoteClick?.(note)} />
      ))}
    </div>
  )
}

function UnfinishedNoteCard({ note, onClick }: { note: Composition; onClick?: () => void }) {
  const patientName = getDisplayName(note.metadata?.patient?.person)
  const noteName = note.metadata?.name ?? 'Untitled Note'

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-lg p-2 text-left transition hover:bg-[var(--link-bg-hover)]"
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-xs font-medium text-amber-700">
        {patientName.charAt(0)}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-[var(--sea-ink)]">{patientName}</p>
        <p className="text-xs text-[var(--sea-ink-soft)]">
          {noteName} · {getRelativeTime(note.updatedAt)}
        </p>
      </div>
      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700">
        {note.metadata?.status ?? 'draft'}
      </span>
    </button>
  )
}

// ════════════════════════════════════════════════════════════════════════════════
// PATIENT NOTES COMPONENTS
// ════════════════════════════════════════════════════════════════════════════════

export function PatientNotesList({ notes }: { notes: PatientNote[] }) {
  if (notes.length === 0) {
    return <p className="py-4 text-center text-sm text-[var(--sea-ink-soft)]">No notes found</p>
  }

  return (
    <div className="space-y-1">
      {notes.map((note) => (
        <div key={note.id} className="flex items-center gap-3 rounded-lg p-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--chip-bg)] text-xs">
            📝
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-[var(--sea-ink)]">{note.noteType ?? 'Note'}</p>
            <p className="text-xs text-[var(--sea-ink-soft)]">{getRelativeTime(note.createdAt)}</p>
          </div>
          <span className={cn(
            'rounded-full px-2 py-0.5 text-xs',
            note.status === 'signed' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'
          )}>
            {note.status}
          </span>
        </div>
      ))}
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════════
// PATIENT SEARCH COMPONENTS
// ════════════════════════════════════════════════════════════════════════════════

export function PatientSearchInput({
  value,
  onChange,
  placeholder = 'Search patients...',
}: {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}) {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <svg className="h-4 w-4 text-[var(--sea-ink-soft)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-[var(--line)] bg-[var(--surface-strong)] py-2 pl-10 pr-4 text-sm text-[var(--sea-ink)] placeholder-[var(--sea-ink-soft)] focus:border-[var(--lagoon)] focus:outline-none focus:ring-1 focus:ring-[var(--lagoon)]"
      />
    </div>
  )
}

export function PatientSearchResults({
  results,
  isLoading,
  onPatientSelect,
}: {
  results: Patient[]
  isLoading?: boolean
  onPatientSelect: (patient: Patient) => void
}) {
  if (isLoading) {
    return (
      <div className="space-y-1 p-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex animate-pulse items-center gap-2 p-2">
            <div className="h-8 w-8 rounded-full bg-[var(--line)]" />
            <div className="flex-1 space-y-1">
              <div className="h-3 w-2/3 rounded bg-[var(--line)]" />
              <div className="h-2 w-1/3 rounded bg-[var(--line)]" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (results.length === 0) {
    return <p className="p-4 text-center text-sm text-[var(--sea-ink-soft)]">No patients found</p>
  }

  return (
    <div className="space-y-1 p-1">
      {results.map((patient) => (
        <button
          key={patient.id}
          type="button"
          onClick={() => onPatientSelect(patient)}
          className="flex w-full items-center gap-2 rounded-lg p-2 text-left transition hover:bg-[var(--link-bg-hover)]"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--seafoam)] text-xs font-medium">
            {getDisplayName(patient.person).charAt(0)}
          </div>
          <div>
            <p className="text-sm font-medium text-[var(--sea-ink)]">{getDisplayName(patient.person)}</p>
            <p className="text-xs text-[var(--sea-ink-soft)]">MRN: {patient.mrn ?? 'N/A'}</p>
          </div>
        </button>
      ))}
    </div>
  )
}
