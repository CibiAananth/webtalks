import type { Patient } from '../../api'
import { cn } from '../../lib/utils'
import { PatientAvatar } from './PatientAvatar'

type PatientCardProps = {
  patient: Patient
  onClick?: () => void
  className?: string
}

export function getPatientDisplayName(patient?: Patient | null): string {
  if (!patient?.person) return 'Unknown Patient'

  const { firstName, lastName, preferredName } = patient.person

  if (firstName && lastName) {
    return `${firstName} ${lastName}`
  }
  if (preferredName) {
    return preferredName
  }
  if (firstName) {
    return firstName
  }
  if (lastName) {
    return lastName
  }
  return 'Unknown Patient'
}

function formatDateOfBirth(person?: Patient['person']): string {
  const dob = person?.dateOfBirth || person?.dob
  if (!dob) return ''
  try {
    return new Date(dob).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  } catch {
    return dob
  }
}

export function PatientCard({ patient, onClick, className }: PatientCardProps) {
  const displayName = getPatientDisplayName(patient)
  const Component = onClick ? 'button' : 'div'

  return (
    <Component
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-3 rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] p-4 text-left',
        onClick && 'cursor-pointer transition hover:border-[var(--lagoon)] hover:shadow-md',
        className
      )}
    >
      <PatientAvatar patient={patient} size="md" />
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-semibold text-[var(--sea-ink)]">
          {displayName}
        </h3>
        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-[var(--sea-ink-soft)]">
          {patient.person?.dateOfBirth && (
            <span>DOB: {formatDateOfBirth(patient.person)}</span>
          )}
          {patient.person?.gender && <span>{patient.person.gender}</span>}
          {patient.person?.age && <span>{patient.person.age}</span>}
          {patient.mrn && <span>MRN: {patient.mrn}</span>}
        </div>
      </div>
    </Component>
  )
}

export function PatientCardCompact({ patient, onClick, className }: PatientCardProps) {
  const displayName = getPatientDisplayName(patient)
  const Component = onClick ? 'button' : 'div'

  return (
    <Component
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-2 rounded-lg p-2 text-left',
        onClick && 'cursor-pointer transition hover:bg-[var(--surface)]',
        className
      )}
    >
      <PatientAvatar patient={patient} size="sm" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-[var(--sea-ink)]">
          {displayName}
        </p>
        {patient.mrn && (
          <p className="text-xs text-[var(--sea-ink-soft)]">MRN: {patient.mrn}</p>
        )}
      </div>
    </Component>
  )
}
