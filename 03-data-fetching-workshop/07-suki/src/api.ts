import ky from 'ky'
import { queryOptions } from '@tanstack/react-query'

// ════════════════════════════════════════════════════════════════════════════════
// CONFIG - Replace these with real values from your browser session
// ════════════════════════════════════════════════════════════════════════════════

export const API_BASE = 'https://web-api-v2.suki-dev.com'
export const ACCESS_TOKEN = "eyJraWQiOiJpRzVfOW5SRGlXbVQtaDgyeU5GNjNWcU8tTFh5RXpkVXJXSUxtRW5sZ040IiwiYWxnIjoiUlMyNTYifQ.eyJ2ZXIiOjEsImp0aSI6IkFULm5rOGdweHZ4ZlVabnROVm1zeUM3NnRqN2k0THJfd2FPYndZaXlVSGpxRHcub2FyNDBsaDQ0NE9ZNDhPVm8waDciLCJpc3MiOiJodHRwczovL3N1a2ktc2FuZGJveC5va3RhcHJldmlldy5jb20vb2F1dGgyL2RlZmF1bHQiLCJhdWQiOiJhcGk6Ly9kZWZhdWx0IiwiaWF0IjoxNzc3OTY2Mjg2LCJleHAiOjE3Nzc5ODQyODYsImNpZCI6IjBvYW5oNWtzb3lKb0pUMDNvMGg3IiwidWlkIjoiMDB1MXVveG84ZTRzanVJMGowaDgiLCJzY3AiOlsib3BlbmlkIiwicHJvZmlsZSIsIm9mZmxpbmVfYWNjZXNzIiwiZW1haWwiXSwiYXV0aF90aW1lIjoxNzc3OTY2MjgzLCJvcmdhbml6YXRpb25JZCI6IjExMTExMTExLTExMTEtMTExMS0xMTExLTExMTExMTExMTExMSIsInN1YiI6ImNhYW5hbnRoQHN1a2kuYWkiLCJyb2xlcyI6WyJVU0VSIiwiQURNSU4iLCJTQ1JJQkUiXSwidXNlcklkIjoiZWJlMTZmNGMtMWNlNy00NzYzLWI2MTgtNGNhMDJjYmVkODI1In0.fAFbnCQ97tkAsrOGk3UOOXMgsj1NNCv9elEsfO_BPpseT_CoaTzriXHb8lDhJQLG6vh9njunzF4KFaz-msvnwy6qKQrrlJS94dZfCDgm43uXp61KXsV8MyxX8QTdWOW08Ez68lJejSn6gkJ6tnG0Lji8WGnX-jTlhUeJHiaP61G31ynYme7V-UFJeEOQJoUhre0kSP0ghVzc9Dsy1Op-nFl3DZs7b6KBZdU_qiktZJHYRqkOetE8Y7ps0T99cs8Bdan0VPmoMSw5mOtphHza6U69VxYYxL1hHBgXqweXIHxNu3knHA7e_seeZtAhVdgN2BGIaH8LruA66vojstKCMQ"
export const USER_EMAIL = 'caananth@suki.ai'

// ════════════════════════════════════════════════════════════════════════════════
// REQUEST HEADERS (matching @suki/business constants)
// ════════════════════════════════════════════════════════════════════════════════

const REQUEST_HEADERS = {
  AUTHORIZATION: 'Authorization',
  ORGANIZATION_ID: 'X-Suki-Organization-Id',
  REQUEST_ID: 'X-Suki-Request-Id',
  TRACE_ID: 'X-Suki-Trace-Id',
  USER_AGENT: 'X-Suki-User-Agent',
  USER_ID: 'X-Suki-User-Id',
  TAB_ID: 'X-Suki-Tab-Id',
} as const

// ════════════════════════════════════════════════════════════════════════════════
// API CLIENT (ky with interceptors - matching frontend-server/api.ts)
// ════════════════════════════════════════════════════════════════════════════════

function generateUUID(): string {
  return crypto.randomUUID()
}

const api = ky.create({
  baseUrl: API_BASE,
  timeout: 50000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
    'Access-Control-Allow-Origin': '*',
  },
  hooks: {
    beforeRequest: [
      ({ request }) => {
        const traceId = generateUUID()
        const requestId = generateUUID()

        // Authorization
        if (ACCESS_TOKEN) {
          request.headers.set(REQUEST_HEADERS.AUTHORIZATION, `Bearer ${ACCESS_TOKEN}`)
        }

        // Request tracking headers
        request.headers.set(REQUEST_HEADERS.REQUEST_ID, requestId)
        request.headers.set(REQUEST_HEADERS.TRACE_ID, traceId)

        // User agent
        request.headers.set(REQUEST_HEADERS.USER_AGENT, navigator.userAgent)

        // Tab ID (for multi-tab support)
        request.headers.set(REQUEST_HEADERS.TAB_ID, generateUUID())
      },
    ],
  },
})

// ════════════════════════════════════════════════════════════════════════════════
// ENDPOINTS (matching frontend-server/endpoints.ts)
// ════════════════════════════════════════════════════════════════════════════════

const Endpoints = {
  Appointments: 'appointments',
  Schedule: 'patients/schedule',
  Compositions: 'compositions',
  UnfinishedNotes: 'compositions/unfinished-count',
  Notes: 'notes',
  Patients: 'patients',
  PatientList: 'patients/list',
  SearchPatient: 'patients/search',
  User: 'auth/me',
} as const

// ════════════════════════════════════════════════════════════════════════════════
// TYPES (matching @suki/business types)
// ════════════════════════════════════════════════════════════════════════════════

export type User = {
  id: string
  email: string
  firstName?: string
  lastName?: string
  name?: string
  avatar?: string
  role?: string
  organizationId?: string
}

export type Person = {
  firstName?: string
  lastName?: string
  middleName?: string
  preferredName?: string
  dateOfBirth?: string | null
  dob?: string | null
  gender?: string
  age?: string
}

export type Patient = {
  id: string
  emrId?: string
  fhirId?: string
  mrn?: string
  person: Person
}

export type Appointment = {
  id: string
  patientId?: string
  patient?: Patient
  owner?: User
  startsAt: string
  endsAt?: string
  type?: string
  status?: string
  noteStatus?: string
  encounterDetails?: {
    encounterType?: string
    visitType?: string
  }
}

export type CompositionMetadata = {
  status?: string
  name?: string
  noteTypeId?: string
  user?: User | null
  patient?: Patient | null
  appointment?: {
    id?: string
    startsAt?: string
    endsAt?: string
    type?: string
  } | null
}

export type Composition = {
  id: string
  userId?: string
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
// PURE FETCH FUNCTIONS
// These match frontend-server implementations exactly
// ════════════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────────
// User (auth/me)
// ─────────────────────────────────────────────────────────────────────────────────

export async function fetchUserDetails(email: string, onLogin = false): Promise<{ user: User }> {
  return api
    .post(Endpoints.User, { json: { email, onLogin } })
    .json<{ user: User }>()
}

// ─────────────────────────────────────────────────────────────────────────────────
// Appointments (patients/schedule)
// ─────────────────────────────────────────────────────────────────────────────────

export async function fetchAppointments(params: {
  startsAtRangeBeginning: string
  startsAtRangeEnd: string
  appointmentId?: string
  filterInternalAppointments?: string
  includeStatuses?: string
}): Promise<{ count: number; results: Appointment[] }> {
  return api
    .get(Endpoints.Schedule, {
      searchParams: {
        startsAtRangeBeginning: params.startsAtRangeBeginning,
        startsAtRangeEnd: params.startsAtRangeEnd,
        ...(params.appointmentId && { appointmentId: params.appointmentId }),
        ...(params.filterInternalAppointments && { filterInternalAppointments: params.filterInternalAppointments }),
        ...(params.includeStatuses && { includeStatuses: params.includeStatuses }),
      },
    })
    .json<{ count: number; results: Appointment[] }>()
}

export async function fetchAppointmentById(appointmentId: string): Promise<{ appointment: Appointment }> {
  return api
    .get(`${Endpoints.Appointments}/${appointmentId}`)
    .json<{ appointment: Appointment }>()
}

// ─────────────────────────────────────────────────────────────────────────────────
// Patients
// ─────────────────────────────────────────────────────────────────────────────────

export async function fetchAllPatients(params?: {
  queryByEmrId?: boolean
  limit?: number
  offset?: number
}): Promise<Patient[]> {
  return api
    .get(Endpoints.Patients, {
      searchParams: {
        ...(params?.queryByEmrId && { queryByEmrId: params.queryByEmrId }),
        ...(params?.limit && { limit: params.limit }),
        ...(params?.offset && { offset: params.offset }),
      },
    })
    .json<Patient[]>()
}

export async function fetchPatientProfile(patientId: string, params?: {
  queryByEmrId?: boolean
  limit?: number
  offset?: number
}): Promise<Patient[]> {
  return api
    .get(`${Endpoints.Patients}/${patientId}`, {
      searchParams: {
        ...(params?.queryByEmrId && { queryByEmrId: params.queryByEmrId }),
        ...(params?.limit && { limit: params.limit }),
        ...(params?.offset && { offset: params.offset }),
      },
    })
    .json<Patient[]>()
}

export async function searchPatients(params: {
  name: string
  limit: number
  emrAccessToken?: string
}): Promise<{ count: number; results: Patient[] }> {
  return api
    .get(Endpoints.SearchPatient, {
      searchParams: {
        name: params.name,
        limit: params.limit,
        ...(params.emrAccessToken && { emrAccessToken: params.emrAccessToken }),
      },
    })
    .json<{ count: number; results: Patient[] }>()
}

// ─────────────────────────────────────────────────────────────────────────────────
// Unfinished Notes (Compositions)
// ─────────────────────────────────────────────────────────────────────────────────

export async function fetchUnfinishedNotes(params?: {
  includeMetadata?: boolean
  includeSections?: boolean
  sortBy?: 'createdAt' | 'appointmentStartTime'
}): Promise<{ count: number; results: Composition[] }> {
  return api
    .get(Endpoints.UnfinishedNotes, {
      searchParams: {
        ...(params?.includeMetadata && { includeMetadata: params.includeMetadata }),
        ...(params?.includeSections && { includeSections: params.includeSections }),
        ...(params?.sortBy && { sortBy: params.sortBy }),
      },
    })
    .json<{ count: number; results: Composition[] }>()
}

export async function fetchCompositionsById(params: {
  ids?: string[]
  includeMetadata?: boolean
  includeSections?: boolean
}): Promise<{ count: number; results: Composition[] }> {
  const searchParams = new URLSearchParams()

  // Format ids as ids[]=value1&ids[]=value2 (required by backend)
  if (params.ids && params.ids.length > 0) {
    params.ids.forEach((id) => searchParams.append('ids[]', id))
  }

  if (params.includeMetadata) {
    searchParams.append('includeMetadata', params.includeMetadata.toString())
  }

  if (params.includeSections) {
    searchParams.append('includeSections', params.includeSections.toString())
  }

  return api
    .get(Endpoints.Compositions, { searchParams })
    .json<{ count: number; results: Composition[] }>()
}

// ─────────────────────────────────────────────────────────────────────────────────
// Patient Notes
// ─────────────────────────────────────────────────────────────────────────────────

export async function fetchPatientNotes(params: {
  patientId: string
  userId?: string
  includeCompositions?: boolean
  offset?: number
  limit?: number
  id?: string
}): Promise<{ count: number; results: PatientNote[]; pageResponse: null }> {
  return api
    .get(Endpoints.Notes, {
      searchParams: {
        patientId: params.patientId,
        ...(params.userId && { userId: params.userId }),
        ...(params.includeCompositions && { includeCompositions: params.includeCompositions }),
        ...(params.offset && { offset: params.offset }),
        ...(params.limit && { limit: params.limit }),
        ...(params.id && { id: params.id }),
      },
    })
    .json<{ count: number; results: PatientNote[]; pageResponse: null }>()
}

// ════════════════════════════════════════════════════════════════════════════════
// QUERY OPTIONS
// Reusable query configurations that use the fetch functions above
// ════════════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────────
// User Query Options
// ─────────────────────────────────────────────────────────────────────────────────

export const userQueryOptions = (email: string = USER_EMAIL) =>
  queryOptions({
    queryKey: ['user', email],
    queryFn: () => fetchUserDetails(email),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

// ─────────────────────────────────────────────────────────────────────────────────
// Appointments Query Options
// ─────────────────────────────────────────────────────────────────────────────────

export const appointmentsQueryOptions = (params: {
  startsAtRangeBeginning: string
  startsAtRangeEnd: string
  filterInternalAppointments?: string
  includeStatuses?: string
}) =>
  queryOptions({
    queryKey: ['appointments', params.startsAtRangeBeginning, params.startsAtRangeEnd],
    queryFn: () => fetchAppointments(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
  })

export const appointmentByIdQueryOptions = (appointmentId: string) =>
  queryOptions({
    queryKey: ['appointment', appointmentId],
    queryFn: () => fetchAppointmentById(appointmentId),
    staleTime: 1000 * 60 * 2,
    enabled: !!appointmentId,
  })

// ─────────────────────────────────────────────────────────────────────────────────
// Patients Query Options
// ─────────────────────────────────────────────────────────────────────────────────

export const allPatientsQueryOptions = (params?: { limit?: number; offset?: number }) =>
  queryOptions({
    queryKey: ['patients', 'all', params?.limit, params?.offset],
    queryFn: () => fetchAllPatients(params),
    staleTime: 1000 * 60 * 5,
  })

export const patientProfileQueryOptions = (patientId: string) =>
  queryOptions({
    queryKey: ['patient', patientId],
    queryFn: () => fetchPatientProfile(patientId),
    staleTime: 1000 * 60 * 5,
    enabled: !!patientId,
  })

export const searchPatientsQueryOptions = (params: { name: string; limit?: number }) =>
  queryOptions({
    queryKey: ['patients', 'search', params.name, params.limit],
    queryFn: () => searchPatients({ name: params.name, limit: params.limit ?? 10 }),
    staleTime: 1000 * 30, // 30 seconds for search
    enabled: params.name.length >= 2, // Only search if 2+ characters
  })

// ─────────────────────────────────────────────────────────────────────────────────
// Unfinished Notes Query Options
// ─────────────────────────────────────────────────────────────────────────────────

export const unfinishedNotesQueryOptions = (params?: {
  includeMetadata?: boolean
  includeSections?: boolean
  sortBy?: 'createdAt' | 'appointmentStartTime'
}) =>
  queryOptions({
    queryKey: ['notes', 'unfinished', params?.sortBy],
    queryFn: () => fetchUnfinishedNotes(params),
    staleTime: 1000 * 60 * 1, // 1 minute - refresh frequently
  })

export const compositionsByIdQueryOptions = (params: {
  ids: string[]
  includeMetadata?: boolean
  includeSections?: boolean
}) =>
  queryOptions({
    queryKey: ['compositions', params.ids],
    queryFn: () => fetchCompositionsById(params),
    staleTime: 1000 * 60 * 2,
    enabled: params.ids.length > 0,
  })

// ─────────────────────────────────────────────────────────────────────────────────
// Patient Notes Query Options
// ─────────────────────────────────────────────────────────────────────────────────

export const patientNotesQueryOptions = (params: {
  patientId: string
  limit?: number
  offset?: number
  includeCompositions?: boolean
}) =>
  queryOptions({
    queryKey: ['notes', 'patient', params.patientId, params.limit, params.offset],
    queryFn: () => fetchPatientNotes(params),
    staleTime: 1000 * 60 * 2,
    enabled: !!params.patientId,
  })
