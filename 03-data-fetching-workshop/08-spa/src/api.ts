import ky from 'ky'
import { queryOptions } from '@tanstack/react-query'

// ════════════════════════════════════════════════════════════════════════════════
// CONFIG - Replace with your values
// ════════════════════════════════════════════════════════════════════════════════

export const API_BASE = 'https://web-api-v2.suki-dev.com'
export const ACCESS_TOKEN = "eyJraWQiOiJpRzVfOW5SRGlXbVQtaDgyeU5GNjNWcU8tTFh5RXpkVXJXSUxtRW5sZ040IiwiYWxnIjoiUlMyNTYifQ.eyJ2ZXIiOjEsImp0aSI6IkFULm5rOGdweHZ4ZlVabnROVm1zeUM3NnRqN2k0THJfd2FPYndZaXlVSGpxRHcub2FyNDBsaDQ0NE9ZNDhPVm8waDciLCJpc3MiOiJodHRwczovL3N1a2ktc2FuZGJveC5va3RhcHJldmlldy5jb20vb2F1dGgyL2RlZmF1bHQiLCJhdWQiOiJhcGk6Ly9kZWZhdWx0IiwiaWF0IjoxNzc3OTY2Mjg2LCJleHAiOjE3Nzc5ODQyODYsImNpZCI6IjBvYW5oNWtzb3lKb0pUMDNvMGg3IiwidWlkIjoiMDB1MXVveG84ZTRzanVJMGowaDgiLCJzY3AiOlsib3BlbmlkIiwicHJvZmlsZSIsIm9mZmxpbmVfYWNjZXNzIiwiZW1haWwiXSwiYXV0aF90aW1lIjoxNzc3OTY2MjgzLCJvcmdhbml6YXRpb25JZCI6IjExMTExMTExLTExMTEtMTExMS0xMTExLTExMTExMTExMTExMSIsInN1YiI6ImNhYW5hbnRoQHN1a2kuYWkiLCJyb2xlcyI6WyJVU0VSIiwiQURNSU4iLCJTQ1JJQkUiXSwidXNlcklkIjoiZWJlMTZmNGMtMWNlNy00NzYzLWI2MTgtNGNhMDJjYmVkODI1In0.fAFbnCQ97tkAsrOGk3UOOXMgsj1NNCv9elEsfO_BPpseT_CoaTzriXHb8lDhJQLG6vh9njunzF4KFaz-msvnwy6qKQrrlJS94dZfCDgm43uXp61KXsV8MyxX8QTdWOW08Ez68lJejSn6gkJ6tnG0Lji8WGnX-jTlhUeJHiaP61G31ynYme7V-UFJeEOQJoUhre0kSP0ghVzc9Dsy1Op-nFl3DZs7b6KBZdU_qiktZJHYRqkOetE8Y7ps0T99cs8Bdan0VPmoMSw5mOtphHza6U69VxYYxL1hHBgXqweXIHxNu3knHA7e_seeZtAhVdgN2BGIaH8LruA66vojstKCMQ"
export const USER_EMAIL = 'caananth@suki.ai'

// ════════════════════════════════════════════════════════════════════════════════
// TYPES
// ════════════════════════════════════════════════════════════════════════════════

export type User = {
  id: string
  email: string
  firstName?: string
  lastName?: string
  name?: string
  role?: string
}

export type Person = {
  firstName?: string
  lastName?: string
  dateOfBirth?: string | null
  gender?: string
  age?: string
}

export type Patient = {
  id: string
  mrn?: string
  person: Person
}

export type Appointment = {
  id: string
  patient?: Patient
  startsAt: string
  endsAt?: string
  type?: string
  status?: string
  noteStatus?: string
}

export type CompositionMetadata = {
  status?: string
  name?: string
  patient?: Patient | null
  appointment?: {
    id?: string
    startsAt?: string
    type?: string
  } | null
}

export type Composition = {
  id: string
  createdAt?: string | null
  updatedAt?: string | null
  metadata: CompositionMetadata
}

export type PatientNote = {
  id: string
  patientId?: string
  createdAt?: string
  signedAt?: string
  status?: string
  noteType?: string
}

// ════════════════════════════════════════════════════════════════════════════════
// API CLIENT
// ════════════════════════════════════════════════════════════════════════════════

const api = ky.create({
  baseUrl: API_BASE,
  timeout: 50000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
  hooks: {
    beforeRequest: [
      ({ request }) => {
        if (ACCESS_TOKEN && ACCESS_TOKEN !== 'PASTE_YOUR_ACCESS_TOKEN_HERE') {
          request.headers.set('Authorization', `Bearer ${ACCESS_TOKEN}`)
        }
        request.headers.set('X-Suki-Request-Id', crypto.randomUUID())
        request.headers.set('X-Suki-Trace-Id', crypto.randomUUID())
      },
    ],
  },
})

// ════════════════════════════════════════════════════════════════════════════════
// FETCH FUNCTIONS
// ════════════════════════════════════════════════════════════════════════════════

export async function fetchUserDetails(email: string): Promise<{ user: User }> {
  return api.post('auth/me', { json: { email } }).json()
}

export async function fetchAppointments(params: {
  startsAtRangeBeginning: string
  startsAtRangeEnd: string
  filterInternalAppointments?: string
  includeStatuses?: string
}): Promise<{ count: number; results: Appointment[] }> {
  return api.get('patients/schedule', {
    searchParams: {
      startsAtRangeBeginning: params.startsAtRangeBeginning,
      startsAtRangeEnd: params.startsAtRangeEnd,
      ...(params.filterInternalAppointments && { filterInternalAppointments: params.filterInternalAppointments }),
      ...(params.includeStatuses && { includeStatuses: params.includeStatuses }),
    },
  }).json()
}

export async function fetchUnfinishedNotes(params?: {
  includeMetadata?: boolean
}): Promise<{ count: number; results: Composition[] }> {
  return api.get('compositions/unfinished-count', {
    searchParams: {
      ...(params?.includeMetadata && { includeMetadata: String(params.includeMetadata) }),
    },
  }).json()
}

export async function searchPatients(params: {
  name: string
  limit: number
}): Promise<{ count: number; results: Patient[] }> {
  return api.get('patients/search', {
    searchParams: {
      name: params.name,
      limit: String(params.limit),
    },
  }).json()
}

export async function fetchPatientNotes(params: {
  patientId: string
  limit?: number
}): Promise<{ count: number; results: PatientNote[] }> {
  return api.get('notes', {
    searchParams: {
      patientId: params.patientId,
      ...(params.limit && { limit: String(params.limit) }),
    },
  }).json()
}

// ════════════════════════════════════════════════════════════════════════════════
// QUERY OPTIONS
// ════════════════════════════════════════════════════════════════════════════════

export const userQueryOptions = (email: string) =>
  queryOptions({
    queryKey: ['user', email],
    queryFn: () => fetchUserDetails(email),
    staleTime: 1000 * 60 * 5,
  })

export const appointmentsQueryOptions = (params: {
  startsAtRangeBeginning: string
  startsAtRangeEnd: string
  filterInternalAppointments?: string
  includeStatuses?: string
}) =>
  queryOptions({
    queryKey: ['appointments', params.startsAtRangeBeginning, params.startsAtRangeEnd],
    queryFn: () => fetchAppointments(params),
    staleTime: 1000 * 60 * 2,
  })

export const unfinishedNotesQueryOptions = (params?: { includeMetadata?: boolean }) =>
  queryOptions({
    queryKey: ['notes', 'unfinished'],
    queryFn: () => fetchUnfinishedNotes(params),
    staleTime: 1000 * 60,
  })

export const searchPatientsQueryOptions = (params: { name: string; limit?: number }) =>
  queryOptions({
    queryKey: ['patients', 'search', params.name],
    queryFn: () => searchPatients({ name: params.name, limit: params.limit ?? 10 }),
    staleTime: 1000 * 30,
    enabled: params.name.length >= 2,
  })

export const patientNotesQueryOptions = (params: { patientId: string; limit?: number }) =>
  queryOptions({
    queryKey: ['notes', 'patient', params.patientId],
    queryFn: () => fetchPatientNotes(params),
    staleTime: 1000 * 60 * 2,
    enabled: !!params.patientId,
  })
