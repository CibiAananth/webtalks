import type { Appointment } from '../../api'
import { cn } from '../../lib/utils'
import { Badge } from '../ui/Badge'
import { PatientAvatar } from '../patient/PatientAvatar'
import { getPatientDisplayName } from '../patient/PatientCard'

type AppointmentCardProps = {
  appointment: Appointment
  onClick?: () => void
  className?: string
}

function formatTime(dateString: string): string {
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

function formatDate(dateString: string): string {
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return dateString
  }
}

function getStatusVariant(status?: string): 'default' | 'success' | 'warning' | 'error' | 'info' {
  switch (status) {
    case 'completed':
      return 'success'
    case 'in-progress':
      return 'info'
    case 'cancelled':
      return 'error'
    case 'scheduled':
    default:
      return 'default'
  }
}

function getNoteStatusVariant(noteStatus?: string): 'default' | 'success' | 'warning' | 'error' | 'info' {
  switch (noteStatus) {
    case 'SIGNED':
    case 'signed':
      return 'success'
    case 'FINALIZED':
    case 'finished':
      return 'info'
    case 'UNFINISHED':
    case 'unfinished':
      return 'warning'
    default:
      return 'default'
  }
}

export function AppointmentCard({ appointment, onClick, className }: AppointmentCardProps) {
  const Component = onClick ? 'button' : 'div'
  const patientName = getPatientDisplayName(appointment.patient)

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
      <PatientAvatar patient={appointment.patient} size="md" />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="truncate text-sm font-semibold text-[var(--sea-ink)]">
            {patientName}
          </h3>
          <div className="flex flex-shrink-0 gap-1">
            {appointment.status && (
              <Badge variant={getStatusVariant(appointment.status)}>
                {appointment.status}
              </Badge>
            )}
          </div>
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-[var(--sea-ink-soft)]">
          <span>{formatDate(appointment.startsAt)}</span>
          <span>
            {formatTime(appointment.startsAt)}
            {appointment.endsAt && ` - ${formatTime(appointment.endsAt)}`}
          </span>
          {appointment.type && <span>{appointment.type}</span>}
        </div>
        {appointment.noteStatus && (
          <div className="mt-2">
            <Badge variant={getNoteStatusVariant(appointment.noteStatus)} className="text-[10px]">
              Note: {appointment.noteStatus}
            </Badge>
          </div>
        )}
      </div>
    </Component>
  )
}

export function AppointmentCardCompact({ appointment, onClick, className }: AppointmentCardProps) {
  const patientName = getPatientDisplayName(appointment.patient)

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-2 rounded-lg p-2 text-left transition hover:bg-[var(--surface)]',
        className
      )}
    >
      <div className="flex h-10 w-10 flex-col items-center justify-center rounded-lg bg-[var(--surface)] text-center">
        <span className="text-xs font-semibold text-[var(--lagoon-deep)]">
          {formatTime(appointment.startsAt).split(' ')[0]}
        </span>
        <span className="text-[10px] text-[var(--sea-ink-soft)]">
          {formatTime(appointment.startsAt).split(' ')[1]}
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-[var(--sea-ink)]">
          {patientName}
        </p>
        {appointment.type && (
          <p className="text-xs text-[var(--sea-ink-soft)]">{appointment.type}</p>
        )}
      </div>
      {appointment.noteStatus && (
        <Badge variant={getNoteStatusVariant(appointment.noteStatus)} className="text-[10px]">
          {appointment.noteStatus}
        </Badge>
      )}
    </button>
  )
}
