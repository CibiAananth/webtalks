import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import type { Patient } from '../api'
import {
  mockUser,
  mockAppointments,
  mockUnfinishedNotes,
  searchPatients,
  getPatientNotes,
} from '../mock'
import {
  UserCard,
  AppointmentList,
  UnfinishedNotesList,
  PatientSearchInput,
  PatientSearchResults,
  PatientNotesList,
  Section,
  Card,
  CardContent,
} from '../components'

// ════════════════════════════════════════════════════════════════════════════════
// ROUTE DEFINITION
// ════════════════════════════════════════════════════════════════════════════════

export const Route = createFileRoute('/dashboard')({
  component: Dashboard,
})

// ════════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════════════════════════

function Dashboard() {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)

  // ┌─────────────────────────────────────────────────────────────────────────────┐
  // │ MOCK DATA - Replace these with API calls during demo                        │
  // └─────────────────────────────────────────────────────────────────────────────┘

  const user = mockUser
  const appointments = mockAppointments
  const unfinishedNotes = mockUnfinishedNotes
  const patientNotes = selectedPatient ? getPatientNotes(selectedPatient.id) : []

  // ┌─────────────────────────────────────────────────────────────────────────────┐
  // │ RENDER                                                                       │
  // └─────────────────────────────────────────────────────────────────────────────┘

  return (
    <div className="page-wrap py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--sea-ink)]">Dashboard</h1>
        <p className="mt-1 text-sm text-[var(--sea-ink-soft)]">
          Live coding demo - replace mock data with real API calls
        </p>
      </div>

      <div className="space-y-6">
        {/* Top Row: User Card + Patient Search */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* User Card */}
          <Section title="Current User" description="Blocking pattern">
            <UserCard user={user} />
          </Section>

          {/* Patient Search */}
          <Section title="Patient Search" description="Client-side with enabled flag">
            <PatientSearchSection onPatientSelect={setSelectedPatient} />
          </Section>
        </div>

        {/* Dashboard Grid - 3 columns when patient selected */}
        <div className={`grid gap-6 ${selectedPatient ? 'lg:grid-cols-3' : 'lg:grid-cols-2'}`}>
          {/* Appointments */}
          <Section title="Today's Appointments" description="Fire & forget + Suspense">
            <div className="max-h-96 overflow-y-auto rounded-lg border border-[var(--line)] bg-[var(--surface)] p-2">
              <AppointmentList
                appointments={appointments}
                compact
                onAppointmentClick={(apt) => apt.patient && setSelectedPatient(apt.patient)}
              />
            </div>
          </Section>

          {/* Unfinished Notes */}
          <Section title="Unfinished Notes" description="Fire & forget + Suspense">
            <div className="max-h-96 overflow-y-auto rounded-lg border border-[var(--line)] bg-[var(--surface)] p-2">
              <UnfinishedNotesList
                notes={unfinishedNotes}
                compact
                onNoteClick={(note) => note.metadata?.patient && setSelectedPatient(note.metadata.patient)}
              />
            </div>
          </Section>

          {/* Patient Notes - shows when patient selected */}
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
                <PatientNotesList notes={patientNotes} compact />
              </div>
            </Section>
          )}
        </div>
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════════
// PATIENT SEARCH (Client-side mock search)
// ════════════════════════════════════════════════════════════════════════════════

function PatientSearchSection({
  onPatientSelect,
}: {
  onPatientSelect: (patient: Patient) => void
}) {
  const [searchQuery, setSearchQuery] = useState('')

  // ┌─────────────────────────────────────────────────────────────────────────────┐
  // │ MOCK SEARCH - Replace with useQuery during demo                             │
  // └─────────────────────────────────────────────────────────────────────────────┘

  const results = searchQuery.length >= 2 ? searchPatients(searchQuery) : []
  const isLoading = false

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
              <PatientSearchResults
                results={results}
                isLoading={isLoading}
                onPatientSelect={handleSelect}
              />
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
