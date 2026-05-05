import { Suspense, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery, useQuery } from '@tanstack/react-query'
import {
  userQueryOptions,
  appointmentsQueryOptions,
  unfinishedNotesQueryOptions,
  searchPatientsQueryOptions,
  patientNotesQueryOptions,
  USER_EMAIL,
  type Patient,
} from '../../api'
import {
  UserCard,
  AppointmentList,
  UnfinishedNotesList,
  PatientSearchInput,
  PatientSearchResults,
  PatientNotesList,
  Section,
  SkeletonList,
  Card,
  CardContent,
  ErrorDisplay,
} from '../../components'

// ════════════════════════════════════════════════════════════════════════════════
// ROUTE DEFINITION
// ════════════════════════════════════════════════════════════════════════════════

export const Route = createFileRoute('/backup/')({
  // Pattern 1: BLOCKING - User data is critical, block navigation until loaded
  loader: async ({ context }) => {
    const { queryClient } = context

    // This blocks - user won't see the page until this resolves
    const { user } = await queryClient.ensureQueryData(userQueryOptions(USER_EMAIL))

    // Pattern 2: FIRE & FORGET - Prefetch in loader, render with Suspense
    // These start fetching but DON'T block navigation
    const today = new Date()
    const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString()
    const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString()

    // Fire & forget - prefetch without awaiting
    queryClient.prefetchQuery(
      appointmentsQueryOptions({
        startsAtRangeBeginning: startOfDay,
        startsAtRangeEnd: endOfDay,
        filterInternalAppointments: 'true',
        includeStatuses: 'true',
      })
    )

    queryClient.prefetchQuery(unfinishedNotesQueryOptions({ includeMetadata: true }))

    return { user }
  },

  // Show while loader is blocking (waiting for user data)
  pendingComponent: () => (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[var(--lagoon)] border-t-transparent" />
        <p className="mt-3 text-sm text-[var(--sea-ink-soft)]">Loading user...</p>
      </div>
    </div>
  ),

  errorComponent: ({ error }) => (
    <ErrorDisplay
      title="Failed to load"
      message={error.message}
      className="mx-auto max-w-md"
    />
  ),

  component: BackupDashboard,
})

// ════════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════════════════════════

function BackupDashboard() {
  const { user } = Route.useLoaderData()
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)

  return (
    <div className="space-y-6">
      {/* Top Row: User Card + Patient Search */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* User Card - Already loaded (blocking) */}
        <Section title="Current User" description="Blocking pattern">
          <UserCard user={user} />
        </Section>

        {/* Patient Search - Client-side with enabled flag */}
        <Section title="Patient Search" description="Client-side with enabled flag">
          <PatientSearchSection onPatientSelect={setSelectedPatient} />
        </Section>
      </div>

      {/* Dashboard Grid - 3 columns when patient selected */}
      <div className={`grid gap-6 ${selectedPatient ? 'lg:grid-cols-3' : 'lg:grid-cols-2'}`}>
        {/* Appointments - Fire & Forget with Suspense */}
        <Section title="Today's Appointments" description="Fire & forget + Suspense">
          <div className="max-h-96 overflow-y-auto rounded-lg border border-[var(--line)] bg-[var(--surface)] p-2">
            <Suspense fallback={<SkeletonList count={3} />}>
              <AppointmentsSection onSelectPatient={setSelectedPatient} />
            </Suspense>
          </div>
        </Section>

        {/* Unfinished Notes - Fire & Forget with Suspense */}
        <Section title="Unfinished Notes" description="Fire & forget + Suspense">
          <div className="max-h-96 overflow-y-auto rounded-lg border border-[var(--line)] bg-[var(--surface)] p-2">
            <Suspense fallback={<SkeletonList count={3} />}>
              <UnfinishedNotesSection onSelectPatient={setSelectedPatient} />
            </Suspense>
          </div>
        </Section>

        {/* Patient Notes - Conditional fetch when patient selected */}
        {selectedPatient && (
          <Section
            title={`${selectedPatient.person?.firstName || 'Patient'} ${selectedPatient.person?.lastName || ''}`}
            description="Notes for selected patient"
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
              <Suspense fallback={<SkeletonList count={2} />}>
                <PatientNotesSection patientId={selectedPatient.id} />
              </Suspense>
            </div>
          </Section>
        )}
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════════
// SUSPENSE SECTIONS (use useSuspenseQuery - will suspend until data is ready)
// ════════════════════════════════════════════════════════════════════════════════

function AppointmentsSection({ onSelectPatient }: { onSelectPatient: (patient: Patient) => void }) {
  const today = new Date()
  const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString()
  const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString()

  // useSuspenseQuery - suspends until data is available
  // Works with prefetchQuery from loader - if data is cached, no suspend
  const { data } = useSuspenseQuery(
    appointmentsQueryOptions({
      startsAtRangeBeginning: startOfDay,
      startsAtRangeEnd: endOfDay,
      filterInternalAppointments: 'true',
      includeStatuses: 'true',
    })
  )

  return (
    <AppointmentList
      appointments={data.results}
      compact
      onAppointmentClick={(apt) => apt.patient && onSelectPatient(apt.patient)}
    />
  )
}

function UnfinishedNotesSection({ onSelectPatient }: { onSelectPatient: (patient: Patient) => void }) {
  const { data } = useSuspenseQuery(
    unfinishedNotesQueryOptions({ includeMetadata: true })
  )

  return (
    <UnfinishedNotesList
      notes={data.results}
      compact
      onNoteClick={(note) => note.metadata?.patient && onSelectPatient(note.metadata.patient)}
    />
  )
}

function PatientNotesSection({ patientId }: { patientId: string }) {
  const { data } = useSuspenseQuery(
    patientNotesQueryOptions({ patientId, limit: 10 })
  )

  return <PatientNotesList notes={data.results} compact />
}

// ════════════════════════════════════════════════════════════════════════════════
// CLIENT-SIDE SEARCH (uses useQuery with enabled flag)
// ════════════════════════════════════════════════════════════════════════════════

function PatientSearchSection({
  onPatientSelect,
}: {
  onPatientSelect: (patient: Patient) => void
}) {
  const [searchQuery, setSearchQuery] = useState('')

  // useQuery with enabled - only fetches when query is long enough
  const { data, isLoading, isError, error } = useQuery({
    ...searchPatientsQueryOptions({ name: searchQuery, limit: 10 }),
    // enabled is already in searchPatientsQueryOptions (name.length >= 2)
  })

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
