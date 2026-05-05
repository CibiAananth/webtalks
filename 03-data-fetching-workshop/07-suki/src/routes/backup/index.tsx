import { Suspense, useState } from 'react'
import { createFileRoute, Await } from '@tanstack/react-router'
import { useSuspenseQuery, useQuery } from '@tanstack/react-query'
import { defer } from '@tanstack/react-router'
import {
  appointmentsQueryOptions,
  unfinishedNotesQueryOptions,
  searchPatientsQueryOptions,
  patientNotesQueryOptions,
  USER_EMAIL,
  type Patient,
} from '../../api'
import { getUser, getDashboardStats, type DashboardStats } from '../../server-fns'
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
  StatsCard,
  StatsCardSkeleton,
} from '../../components'

// ════════════════════════════════════════════════════════════════════════════════
// ROUTE DEFINITION
// ════════════════════════════════════════════════════════════════════════════════

export const Route = createFileRoute('/backup/')(({
  loader: async ({ context }) => {
    const { queryClient } = context

    // ┌─────────────────────────────────────────────────────────────────────────────┐
    // │ Pattern 1: BLOCKING with SERVER FUNCTION                                    │
    // │ User data is critical - block navigation until loaded                       │
    // │ Using server function: runs on server, can access server-only resources     │
    // └─────────────────────────────────────────────────────────────────────────────┘
    const { user } = await getUser({ data: { email: USER_EMAIL } })

    // ┌─────────────────────────────────────────────────────────────────────────────┐
    // │ Pattern 2: FIRE & FORGET - Prefetch for Suspense sections                   │
    // │ Start fetching but DON'T block navigation                                   │
    // └─────────────────────────────────────────────────────────────────────────────┘
    const today = new Date()
    const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString()
    const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString()

    queryClient.prefetchQuery(
      appointmentsQueryOptions({
        startsAtRangeBeginning: startOfDay,
        startsAtRangeEnd: endOfDay,
        filterInternalAppointments: 'true',
        includeStatuses: 'true',
      })
    )

    queryClient.prefetchQuery(unfinishedNotesQueryOptions({ includeMetadata: true }))

    // ┌─────────────────────────────────────────────────────────────────────────────┐
    // │ Pattern 3: DEFER - Non-critical data that streams in later                  │
    // │ Dashboard stats are nice-to-have, not blocking                              │
    // │ Using server function for aggregation                                       │
    // └─────────────────────────────────────────────────────────────────────────────┘
    const statsPromise = getDashboardStats({ data: { email: USER_EMAIL } })

    return {
      user,
      // defer() wraps the promise - component renders immediately, data streams in
      deferredStats: defer(statsPromise),
    }
  },

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
}))

// ════════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════════════════════════

function BackupDashboard() {
  const { user, deferredStats } = Route.useLoaderData()
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)

  return (
    <div className="space-y-6">
      {/* Top Row: User Card + Patient Search */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* User Card - Loaded via blocking server function */}
        <Section title="Current User" description="Blocking + Server Function">
          <UserCard user={user} />
        </Section>

        {/* Patient Search - Client-side with enabled flag */}
        <Section title="Patient Search" description="Client-side with enabled flag">
          <PatientSearchSection onPatientSelect={setSelectedPatient} />
        </Section>
      </div>

      {/* Stats Row - Deferred/Streaming */}
      <Section
        title="Dashboard Stats"
        description="Defer pattern - streams in after initial render"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Await component handles the deferred promise */}
          <Await promise={deferredStats} fallback={<DeferredStatsSkeleton />}>
            {(stats) => <DeferredStatsDisplay stats={stats} />}
          </Await>
        </div>
      </Section>

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
// DEFERRED STATS (uses Await for streaming)
// ════════════════════════════════════════════════════════════════════════════════

function DeferredStatsSkeleton() {
  return (
    <>
      <StatsCardSkeleton />
      <StatsCardSkeleton />
    </>
  )
}

function DeferredStatsDisplay({ stats }: { stats: DashboardStats }) {
  return (
    <>
      <StatsCard
        title="Today's Appointments"
        stats={[
          { label: 'Total', value: stats.todaysAppointments.total },
          { label: 'Completed', value: stats.todaysAppointments.completed, variant: 'success' },
          { label: 'In Progress', value: stats.todaysAppointments.inProgress, variant: 'info' },
          { label: 'Upcoming', value: stats.todaysAppointments.upcoming },
        ]}
      />
      <StatsCard
        title="Unfinished Notes"
        stats={[
          { label: 'Total', value: stats.unfinishedNotes.total, variant: stats.unfinishedNotes.total > 0 ? 'warning' : 'default' },
          { label: 'Drafts', value: stats.unfinishedNotes.drafts },
          { label: 'In Progress', value: stats.unfinishedNotes.inProgress },
          { label: 'Oldest (days)', value: stats.unfinishedNotes.oldestDays ?? '-' },
        ]}
      />
    </>
  )
}

// ════════════════════════════════════════════════════════════════════════════════
// SUSPENSE SECTIONS (use useSuspenseQuery - will suspend until data is ready)
// ════════════════════════════════════════════════════════════════════════════════

function AppointmentsSection({ onSelectPatient }: { onSelectPatient: (patient: Patient) => void }) {
  const today = new Date()
  const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString()
  const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString()

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

  const { data, isLoading, isError, error } = useQuery({
    ...searchPatientsQueryOptions({ name: searchQuery, limit: 10 }),
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
