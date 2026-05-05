import { createServerFn } from '@tanstack/react-start'
import {
  fetchUserDetails,
  fetchAppointments,
  fetchUnfinishedNotes,
  fetchPatientNotes,
  fetchPatientProfile,
  type Patient,
  type PatientNote,
} from './api'

// ════════════════════════════════════════════════════════════════════════════════
// SERVER FUNCTIONS
// These run on the server only - useful for:
// 1. Aggregating multiple API calls to avoid client waterfall
// 2. Accessing server-only resources (env vars, databases)
// 3. Heavy computations that shouldn't run on client
// ════════════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────────
// PATTERN: Server-side aggregation
// Real use case: Get a patient's complete summary (profile + notes) in one call
// Benefit: Avoids N+1 waterfall on client (fetch patient → then fetch notes)
// ─────────────────────────────────────────────────────────────────────────────────

export type PatientSummary = {
  patient: Patient
  recentNotes: PatientNote[]
  totalNotes: number
}

export const getPatientSummary = createServerFn()
  .inputValidator((data: { patientId: string }) => data)
  .handler(async ({ data }): Promise<PatientSummary> => {
    const { patientId } = data

    // Parallel fetch on server - no waterfall
    const [patientResult, notesResult] = await Promise.all([
      fetchPatientProfile(patientId),
      fetchPatientNotes({ patientId, limit: 5 }),
    ])

    // Return aggregated data
    return {
      patient: patientResult[0],
      recentNotes: notesResult.results,
      totalNotes: notesResult.count,
    }
  })

// ─────────────────────────────────────────────────────────────────────────────────
// PATTERN: Dashboard statistics aggregation
// Real use case: Compute dashboard stats from multiple sources
// Benefit: Heavy aggregation runs on server, not client
// ─────────────────────────────────────────────────────────────────────────────────

export type DashboardStats = {
  todaysAppointments: {
    total: number
    completed: number
    inProgress: number
    upcoming: number
  }
  unfinishedNotes: {
    total: number
    drafts: number
    inProgress: number
    oldestDays: number | null
  }
  fetchedAt: string
}

export const getDashboardStats = createServerFn()
  .inputValidator((data: { email: string }) => data)
  .handler(async (_ctx): Promise<DashboardStats> => {
    const today = new Date()
    const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString()
    const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString()

    // Parallel fetch all data needed for stats
    const [appointmentsResult, notesResult] = await Promise.all([
      fetchAppointments({
        startsAtRangeBeginning: startOfDay,
        startsAtRangeEnd: endOfDay,
        filterInternalAppointments: 'true',
        includeStatuses: 'true',
      }),
      fetchUnfinishedNotes({ includeMetadata: true }),
    ])

    // Compute appointment stats
    const appointments = appointmentsResult.results
    const appointmentStats = {
      total: appointments.length,
      completed: appointments.filter((a) => a.status === 'completed').length,
      inProgress: appointments.filter((a) => a.status === 'in-progress').length,
      upcoming: appointments.filter((a) => a.status === 'scheduled').length,
    }

    // Compute notes stats
    const notes = notesResult.results
    let oldestDays: number | null = null
    if (notes.length > 0) {
      const oldestNote = notes.reduce((oldest, note) => {
        const noteDate = new Date(note.createdAt || 0)
        const oldestDate = new Date(oldest.createdAt || 0)
        return noteDate < oldestDate ? note : oldest
      })
      if (oldestNote.createdAt) {
        const diffMs = Date.now() - new Date(oldestNote.createdAt).getTime()
        oldestDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
      }
    }

    const notesStats = {
      total: notes.length,
      drafts: notes.filter((n) => n.metadata?.status === 'DRAFT').length,
      inProgress: notes.filter((n) => n.metadata?.status === 'IN_PROGRESS').length,
      oldestDays,
    }

    return {
      todaysAppointments: appointmentStats,
      unfinishedNotes: notesStats,
      fetchedAt: new Date().toISOString(),
    }
  })

// ─────────────────────────────────────────────────────────────────────────────────
// PATTERN: Server-side user initialization
// Real use case: Fetch user and perform server-side validation/logging
// Benefit: Can access server env vars, logs, etc.
// ─────────────────────────────────────────────────────────────────────────────────

export const getUser = createServerFn()
  .inputValidator((data: { email: string }) => data)
  .handler(async ({ data }) => {
    const { email } = data

    // Could add server-side logging, metrics, etc. here
    console.log(`[Server] Fetching user: ${email}`)

    const result = await fetchUserDetails(email)

    // Could filter sensitive data before returning to client
    return result
  })
