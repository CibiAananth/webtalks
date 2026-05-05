import type { Patient } from '../../api'
import { cn } from '../../lib/utils'
import { EmptyState } from '../ui/EmptyState'
import { PatientCard, PatientCardCompact } from './PatientCard'

type PatientListProps = {
  patients: Patient[]
  onPatientClick?: (patient: Patient) => void
  compact?: boolean
  className?: string
}

export function PatientList({
  patients,
  onPatientClick,
  compact = false,
  className,
}: PatientListProps) {
  if (patients.length === 0) {
    return (
      <EmptyState
        title="No patients found"
        description="There are no patients to display."
      />
    )
  }

  const CardComponent = compact ? PatientCardCompact : PatientCard

  return (
    <div className={cn('space-y-2', className)}>
      {patients.map((patient) => (
        <CardComponent
          key={patient.id}
          patient={patient}
          onClick={onPatientClick ? () => onPatientClick(patient) : undefined}
        />
      ))}
    </div>
  )
}
