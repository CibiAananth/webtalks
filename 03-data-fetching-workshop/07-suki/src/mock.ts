import type { User, Patient, Appointment, Composition, PatientNote } from './api'

// ════════════════════════════════════════════════════════════════════════════════
// MOCK USER
// ════════════════════════════════════════════════════════════════════════════════

export const mockUser: User = {
  id: 'user-1',
  email: 'doctor@clinic.com',
  firstName: 'Sarah',
  lastName: 'Johnson',
  role: 'Physician',
  organizationId: 'org-1',
}

// ════════════════════════════════════════════════════════════════════════════════
// MOCK PATIENTS
// ════════════════════════════════════════════════════════════════════════════════

export const mockPatients: Patient[] = [
  {
    id: 'patient-1',
    mrn: 'MRN-001',
    person: {
      firstName: 'John',
      lastName: 'Smith',
      dateOfBirth: '1985-03-15',
      gender: 'Male',
      age: '39',
    },
  },
  {
    id: 'patient-2',
    mrn: 'MRN-002',
    person: {
      firstName: 'Emily',
      lastName: 'Davis',
      dateOfBirth: '1992-07-22',
      gender: 'Female',
      age: '32',
    },
  },
  {
    id: 'patient-3',
    mrn: 'MRN-003',
    person: {
      firstName: 'Michael',
      lastName: 'Brown',
      dateOfBirth: '1978-11-08',
      gender: 'Male',
      age: '46',
    },
  },
  {
    id: 'patient-4',
    mrn: 'MRN-004',
    person: {
      firstName: 'Jessica',
      lastName: 'Wilson',
      dateOfBirth: '1990-01-30',
      gender: 'Female',
      age: '34',
    },
  },
  {
    id: 'patient-5',
    mrn: 'MRN-005',
    person: {
      firstName: 'David',
      lastName: 'Martinez',
      dateOfBirth: '1965-09-12',
      gender: 'Male',
      age: '59',
    },
  },
]

// ════════════════════════════════════════════════════════════════════════════════
// MOCK APPOINTMENTS (Today)
// ════════════════════════════════════════════════════════════════════════════════

const today = new Date()
const makeTime = (hour: number, minute: number) => {
  const d = new Date(today)
  d.setHours(hour, minute, 0, 0)
  return d.toISOString()
}

export const mockAppointments: Appointment[] = [
  {
    id: 'apt-1',
    patient: mockPatients[0],
    startsAt: makeTime(9, 0),
    endsAt: makeTime(9, 30),
    type: 'Follow-up',
    status: 'completed',
    noteStatus: 'SIGNED',
  },
  {
    id: 'apt-2',
    patient: mockPatients[1],
    startsAt: makeTime(10, 0),
    endsAt: makeTime(10, 30),
    type: 'New Patient',
    status: 'completed',
    noteStatus: 'UNFINISHED',
  },
  {
    id: 'apt-3',
    patient: mockPatients[2],
    startsAt: makeTime(11, 0),
    endsAt: makeTime(11, 45),
    type: 'Annual Physical',
    status: 'in-progress',
    noteStatus: 'UNFINISHED',
  },
  {
    id: 'apt-4',
    patient: mockPatients[3],
    startsAt: makeTime(14, 0),
    endsAt: makeTime(14, 30),
    type: 'Follow-up',
    status: 'scheduled',
  },
  {
    id: 'apt-5',
    patient: mockPatients[4],
    startsAt: makeTime(15, 30),
    endsAt: makeTime(16, 0),
    type: 'Consultation',
    status: 'scheduled',
  },
]

// ════════════════════════════════════════════════════════════════════════════════
// MOCK UNFINISHED NOTES (Compositions)
// ════════════════════════════════════════════════════════════════════════════════

export const mockUnfinishedNotes: Composition[] = [
  {
    id: 'comp-1',
    userId: 'user-1',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 min ago
    metadata: {
      status: 'IN_PROGRESS',
      name: 'Progress Note',
      patient: mockPatients[1],
      appointment: {
        id: 'apt-2',
        startsAt: makeTime(10, 0),
        type: 'New Patient',
      },
    },
  },
  {
    id: 'comp-2',
    userId: 'user-1',
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
    updatedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 min ago
    metadata: {
      status: 'IN_PROGRESS',
      name: 'Annual Physical',
      patient: mockPatients[2],
      appointment: {
        id: 'apt-3',
        startsAt: makeTime(11, 0),
        type: 'Annual Physical',
      },
    },
  },
  {
    id: 'comp-3',
    userId: 'user-1',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
    updatedAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
    metadata: {
      status: 'DRAFT',
      name: 'Follow-up Note',
      patient: mockPatients[4],
      appointment: {
        id: 'apt-old',
        startsAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        type: 'Follow-up',
      },
    },
  },
]

// ════════════════════════════════════════════════════════════════════════════════
// MOCK PATIENT NOTES
// ════════════════════════════════════════════════════════════════════════════════

export const mockPatientNotes: Record<string, PatientNote[]> = {
  'patient-1': [
    {
      id: 'note-1-1',
      patientId: 'patient-1',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      signedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'signed',
      noteType: 'Follow-up Note',
    },
    {
      id: 'note-1-2',
      patientId: 'patient-1',
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      signedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'signed',
      noteType: 'Progress Note',
    },
  ],
  'patient-2': [
    {
      id: 'note-2-1',
      patientId: 'patient-2',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      status: 'draft',
      noteType: 'New Patient Note',
    },
  ],
  'patient-3': [
    {
      id: 'note-3-1',
      patientId: 'patient-3',
      createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
      signedAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'signed',
      noteType: 'Annual Physical',
    },
  ],
  'patient-4': [],
  'patient-5': [
    {
      id: 'note-5-1',
      patientId: 'patient-5',
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      signedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'signed',
      noteType: 'Consultation Note',
    },
    {
      id: 'note-5-2',
      patientId: 'patient-5',
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      signedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'signed',
      noteType: 'Follow-up Note',
    },
  ],
}

// Helper to get notes for a patient
export function getPatientNotes(patientId: string): PatientNote[] {
  return mockPatientNotes[patientId] ?? []
}

// Helper to search patients
export function searchPatients(query: string): Patient[] {
  const lowerQuery = query.toLowerCase()
  return mockPatients.filter((p) => {
    const firstName = p.person?.firstName?.toLowerCase() ?? ''
    const lastName = p.person?.lastName?.toLowerCase() ?? ''
    const mrn = p.mrn?.toLowerCase() ?? ''
    return firstName.includes(lowerQuery) || lastName.includes(lowerQuery) || mrn.includes(lowerQuery)
  })
}
