import type { Appointment } from '../../api'
import { cn } from '../../lib/utils'
import { EmptyState } from '../ui/EmptyState'
import { AppointmentCard, AppointmentCardCompact } from './AppointmentCard'

type AppointmentListProps = {
  appointments: Appointment[]
  onAppointmentClick?: (appointment: Appointment) => void
  compact?: boolean
  className?: string
}

export function AppointmentList({
  appointments,
  onAppointmentClick,
  compact = false,
  className,
}: AppointmentListProps) {
  if (appointments.length === 0) {
    return (
      <EmptyState
        title="No appointments"
        description="There are no appointments scheduled."
        icon={
          <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        }
      />
    )
  }

  const CardComponent = compact ? AppointmentCardCompact : AppointmentCard

  return (
    <div className={cn('space-y-2', className)}>
      {appointments.map((appointment) => (
        <CardComponent
          key={appointment.id}
          appointment={appointment}
          onClick={onAppointmentClick ? () => onAppointmentClick(appointment) : undefined}
        />
      ))}
    </div>
  )
}

type GroupedAppointmentListProps = {
  appointments: Appointment[]
  onAppointmentClick?: (appointment: Appointment) => void
  className?: string
}

function groupByDate(appointments: Appointment[]): Record<string, Appointment[]> {
  return appointments.reduce(
    (acc, appointment) => {
      const date = new Date(appointment.startsAt).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      })
      if (!acc[date]) acc[date] = []
      acc[date].push(appointment)
      return acc
    },
    {} as Record<string, Appointment[]>
  )
}

export function GroupedAppointmentList({
  appointments,
  onAppointmentClick,
  className,
}: GroupedAppointmentListProps) {
  if (appointments.length === 0) {
    return (
      <EmptyState
        title="No appointments"
        description="There are no appointments scheduled."
      />
    )
  }

  const grouped = groupByDate(appointments)

  return (
    <div className={cn('space-y-6', className)}>
      {Object.entries(grouped).map(([date, dayAppointments]) => (
        <div key={date}>
          <h3 className="mb-3 text-sm font-semibold text-[var(--sea-ink)]">{date}</h3>
          <div className="space-y-2">
            {dayAppointments.map((appointment) => (
              <AppointmentCardCompact
                key={appointment.id}
                appointment={appointment}
                onClick={onAppointmentClick ? () => onAppointmentClick(appointment) : undefined}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
