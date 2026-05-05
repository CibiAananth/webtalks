import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  userQueryOptions,
  appointmentsQueryOptions,
  unfinishedNotesQueryOptions,
  searchPatientsQueryOptions,
  patientNotesQueryOptions,
  USER_EMAIL,
  type Patient,
} from '../api'
import {
  Section,
  Card,
  CardContent,
  SkeletonCard,
  SkeletonList,
  ErrorDisplay,
  StatsCard,
  StatsCardSkeleton,
} from '../components/ui'
import {
  UserCard,
  AppointmentList,
  UnfinishedNotesList,
  PatientNotesList,
  PatientSearchInput,
  PatientSearchResults,
} from '../components/domain'

// ════════════════════════════════════════════════════════════════════════════════
// DEMO PAGE - Traditional SPA Pattern
// All data fetching happens client-side with loading states
// NO SSR, NO Suspense, NO route loaders
// ════════════════════════════════════════════════════════════════════════════════

export function Demo() {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)

  return (
    <div className="page-wrap py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--sea-ink)]">Dashboard Demo</h1>
        <p className="mt-1 text-sm text-[var(--sea-ink-soft)]">
          Traditional SPA - Watch the loading sequence and network waterfall
        </p>
      </div>

      <div className="space-y-6">
        {/* Top Row: User + Search */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* User Card - Fetches on mount */}
          <Section title="Current User" description="useQuery - fetches when component mounts">
            <UserSection />
          </Section>

          {/* Patient Search */}
          <Section title="Patient Search" description="useQuery with enabled flag">
            <PatientSearchSection onPatientSelect={setSelectedPatient} />
          </Section>
        </div>

        {/* Stats Row - Also fetches on mount */}
        <Section title="Dashboard Stats" description="Computed from appointments + notes">
          <StatsSection />
        </Section>

        {/* Main Grid */}
        <div className={`grid gap-6 ${selectedPatient ? 'lg:grid-cols-3' : 'lg:grid-cols-2'}`}>
          {/* Appointments */}
          <Section title="Today's Appointments" description="useQuery - loads after user">
            <div className="max-h-96 overflow-y-auto rounded-lg border border-[var(--line)] bg-[var(--surface)] p-2">
              <AppointmentsSection onSelectPatient={setSelectedPatient} />
            </div>
          </Section>

          {/* Unfinished Notes */}
          <Section title="Unfinished Notes" description="useQuery - loads after user">
            <div className="max-h-96 overflow-y-auto rounded-lg border border-[var(--line)] bg-[var(--surface)] p-2">
              <UnfinishedNotesSection onSelectPatient={setSelectedPatient} />
            </div>
          </Section>

          {/* Patient Notes */}
          {selectedPatient && (
            <Section
              title={`${selectedPatient.person?.firstName || 'Patient'} ${selectedPatient.person?.lastName || ''}`}
              description="Fetches when patient selected"
              action={
                <button
                  type="button"
                  onClick={() => setSelectedPatient(null)}
                  className="text-sm text-[var(--lagoon-deep)] hover:underline"
                >
                  Clear
                </button>
              }
            >
              <div className="max-h-96 overflow-y-auto rounded-lg border border-[var(--line)] bg-[var(--surface)] p-2">
                <PatientNotesSection patientId={selectedPatient.id} />
              </div>
            </Section>
          )}
        </div>
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════════
// USER SECTION
// Traditional pattern: useQuery with isLoading check
// ════════════════════════════════════════════════════════════════════════════════

function UserSection() {
  const { data, isLoading, isError, error } = useQuery(userQueryOptions(USER_EMAIL))

  if (isLoading) {
    return <SkeletonCard />
  }

  if (isError) {
    return <ErrorDisplay title="Failed to load user" message={error.message} />
  }

  return <UserCard user={data!.user} />
}

// ════════════════════════════════════════════════════════════════════════════════
// STATS SECTION
// Fetches both appointments and notes, then computes stats
// Shows the "waterfall" problem - must wait for both
// ════════════════════════════════════════════════════════════════════════════════

function StatsSection() {
  const today = new Date()
  const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString()
  const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString()

  const appointmentsQuery = useQuery(
    appointmentsQueryOptions({
      startsAtRangeBeginning: startOfDay,
      startsAtRangeEnd: endOfDay,
      filterInternalAppointments: 'true',
      includeStatuses: 'true',
    })
  )

  const notesQuery = useQuery(unfinishedNotesQueryOptions({ includeMetadata: true }))

  // Must wait for BOTH to compute stats
  const isLoading = appointmentsQuery.isLoading || notesQuery.isLoading
  const isError = appointmentsQuery.isError || notesQuery.isError

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        <StatsCardSkeleton />
        <StatsCardSkeleton />
      </div>
    )
  }

  if (isError) {
    return <ErrorDisplay message="Failed to load stats" />
  }

  const appointments = appointmentsQuery.data?.results ?? []
  const notes = notesQuery.data?.results ?? []

  // Compute stats client-side (this could be done server-side in TanStack Start)
  const appointmentStats = {
    total: appointments.length,
    completed: appointments.filter((a) => a.status === 'completed').length,
    inProgress: appointments.filter((a) => a.status === 'in-progress').length,
    upcoming: appointments.filter((a) => a.status === 'scheduled').length,
  }

  const notesStats = {
    total: notes.length,
    drafts: notes.filter((n) => n.metadata?.status === 'DRAFT').length,
    inProgress: notes.filter((n) => n.metadata?.status === 'IN_PROGRESS').length,
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <StatsCard
        title="Today's Appointments"
        stats={[
          { label: 'Total', value: appointmentStats.total },
          { label: 'Completed', value: appointmentStats.completed, variant: 'success' },
          { label: 'In Progress', value: appointmentStats.inProgress, variant: 'info' },
          { label: 'Upcoming', value: appointmentStats.upcoming },
        ]}
      />
      <StatsCard
        title="Unfinished Notes"
        stats={[
          { label: 'Total', value: notesStats.total, variant: notesStats.total > 0 ? 'warning' : 'default' },
          { label: 'Drafts', value: notesStats.drafts },
          { label: 'In Progress', value: notesStats.inProgress },
        ]}
      />
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════════
// APPOINTMENTS SECTION
// ════════════════════════════════════════════════════════════════════════════════

function AppointmentsSection({ onSelectPatient }: { onSelectPatient: (patient: Patient) => void }) {
  const today = new Date()
  const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString()
  const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString()

  const { data, isLoading, isError, error } = useQuery(
    appointmentsQueryOptions({
      startsAtRangeBeginning: startOfDay,
      startsAtRangeEnd: endOfDay,
      filterInternalAppointments: 'true',
      includeStatuses: 'true',
    })
  )

  if (isLoading) {
    return <SkeletonList count={4} />
  }

  if (isError) {
    return <ErrorDisplay message={error.message} />
  }

  return (
    <AppointmentList
      appointments={data?.results ?? []}
      onAppointmentClick={(apt) => apt.patient && onSelectPatient(apt.patient)}
    />
  )
}

// ════════════════════════════════════════════════════════════════════════════════
// UNFINISHED NOTES SECTION
// ════════════════════════════════════════════════════════════════════════════════

function UnfinishedNotesSection({ onSelectPatient }: { onSelectPatient: (patient: Patient) => void }) {
  const { data, isLoading, isError, error } = useQuery(
    unfinishedNotesQueryOptions({ includeMetadata: true })
  )

  if (isLoading) {
    return <SkeletonList count={3} />
  }

  if (isError) {
    return <ErrorDisplay message={error.message} />
  }

  return (
    <UnfinishedNotesList
      notes={data?.results ?? []}
      onNoteClick={(note) => note.metadata?.patient && onSelectPatient(note.metadata.patient)}
    />
  )
}

// ════════════════════════════════════════════════════════════════════════════════
// PATIENT NOTES SECTION
// ════════════════════════════════════════════════════════════════════════════════

function PatientNotesSection({ patientId }: { patientId: string }) {
  const { data, isLoading, isError, error } = useQuery(
    patientNotesQueryOptions({ patientId, limit: 10 })
  )

  if (isLoading) {
    return <SkeletonList count={2} />
  }

  if (isError) {
    return <ErrorDisplay message={error.message} />
  }

  return <PatientNotesList notes={data?.results ?? []} />
}

// ════════════════════════════════════════════════════════════════════════════════
// PATIENT SEARCH SECTION
// Uses enabled flag - only fetches when query length >= 2
// ════════════════════════════════════════════════════════════════════════════════

function PatientSearchSection({ onPatientSelect }: { onPatientSelect: (patient: Patient) => void }) {
  const [searchQuery, setSearchQuery] = useState('')

  const { data, isLoading, isError, error } = useQuery(
    searchPatientsQueryOptions({ name: searchQuery, limit: 10 })
  )

  const handleSelect = (patient: Patient) => {
    onPatientSelect(patient)
    setSearchQuery('')
  }

  return (
    <Card>
      <CardContent>
        <div className="relative">
          <PatientSearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search patients by name (min 2 characters)..."
          />

          {searchQuery.length >= 2 && (
            <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-64 overflow-y-auto rounded-lg border border-[var(--line)] bg-[var(--surface-strong)] shadow-lg">
              {isError ? (
                <div className="p-3">
                  <ErrorDisplay message={error.message} />
                </div>
              ) : (
                <PatientSearchResults
                  results={data?.results ?? []}
                  isLoading={isLoading}
                  onPatientSelect={handleSelect}
                />
              )}
            </div>
          )}
        </div>

        {searchQuery.length > 0 && searchQuery.length < 2 && (
          <p className="mt-3 text-sm text-[var(--sea-ink-soft)]">
            Type at least 2 characters to search...
          </p>
        )}
      </CardContent>
    </Card>
  )
}
