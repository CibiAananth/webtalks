  Layout v3 - With Suspense Boundaries

  ┌──────────────────────────────────────────────────────────────────────────────────┐
  │ ┌─ HEADER ──────────────────────────────────────────────────────────────────────┐│
  │ │  🩺 Suki Dashboard                                     Dr. Sarah Chen  •  ⚙️  ││                                                                                                 e
  │ │                                                        ▲                      ││
  │ │                                                        │                      ││
  │ │                                            BLOCKING (await fetchUserDetails)  ││
  │ └───────────────────────────────────────────────────────────────────────────────┘│
  │                                                                                  │
  │ ┌─ SUSPENSE BOUNDARY: Unfinished Notes ─────────────────────────────────────────┐│
  │ │  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ ││
  │ │                                  ▼                                            ││
  │ │            FIRE & FORGET: prefetchQuery → useSuspenseQuery                    ││
  │ │                         (loads independently)                                 ││
  │ │ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ││
  │ │  ⚠️ You have 3 unfinished notes                                    [Dismiss] ││
  │ │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                         ││
  │ │  │ John Doe     │  │ Jane Smith   │  │ Bob Wilson   │                         ││
  │ │  └──────────────┘  └──────────────┘  └──────────────┘                         ││
  │ └───────────────────────────────────────────────────────────────────────────────┘│
  │                                                                                  │
  │ ┌─ SUSPENSE: Schedule ──────┐  ┌─ SUSPENSE: Main Content ───────────────────────┐│
  │ │                           │  │                                                ││
  │ │  🔍 Search Patients       │  │  ┌─ SUSPENSE: Patient Header ────────────────┐ ││
  │ │  ┌───────────────────┐    │  │  │  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ ││
  │ │  │ Search...         │    │  │  │                    ▼                      │ ││
  │ │  └───────────────────┘    │  │  │   SERVER FN: getPatientProfile(id)        │ ││
  │ │                           │  │  │          (filters sensitive data)         │ ││
  │ │  ────────────────────     │  │  │ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─│ ││
  │ │                           │  │  │  👤 John Doe                              │ ││
  │ │  📅 Today's Schedule      │  │  │  DOB: 01/15/1985  •  MRN: 12345678        │ ││
  │ │  ░░░░░░░░░░░░░░░░░░░░░   │  │  └───────────────────────────────────────────┘ ││
  │ │            ▼              │  │                                                ││
  │ │   FIRE & FORGET:          │  │  ┌─ SUSPENSE: Patient Notes ─────────────────┐ ││
  │ │   prefetchQuery →         │  │  │  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ ││
  │ │   useSuspenseQuery        │  │  │                    ▼                      │ ││
  │ │ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─  │  │  │   FIRE & FORGET: prefetchQuery →          │ ││
  │ │  ┌───────────────────┐    │  │  │                  useSuspenseQuery         │ ││
  │ │  │ 9:00  John Doe    │    │  │  │ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─│ ││
  │ │  │       Follow-up   │    │  │  │  📄 Visit Note - Dec 15, 2024             │ ││
  │ │  └───────────────────┘    │  │  │     Chief Complaint: Headache...          │ ││
  │ │  ┌───────────────────┐    │  │  │                                           │ ││
  │ │  │ 9:30  Jane Smith  │    │  │  │  📄 Visit Note - Nov 28, 2024             │ ││
  │ │  │       New Patient │    │  │  │     Follow-up for hypertension...         │ ││
  │ │  └───────────────────┘    │  │  │                                           │ ││
  │ │  ┌───────────────────┐    │  │  └───────────────────────────────────────────┘ ││
  │ │  │ 10:00 Bob Wilson  │◀───┼──┼─── PREFETCH on hover                           ││
  │ │  │       Check-up    │    │  │                                                ││
  │ │  └───────────────────┘    │  │                                                ││
  │ │                           │  │                                                ││
  │ └───────────────────────────┘  └────────────────────────────────────────────────┘│
  └──────────────────────────────────────────────────────────────────────────────────┘

  Data Flow - Corrected

  PAGE LOAD (/ route)
  ═══════════════════════════════════════════════════════════════════════════════════

  LOADER:
  ┌─────────────────────────────────────────────────────────────────────────────────┐
  │                                                                                 │
  │   // BLOCKING - must complete before render                                     │
  │   const user = await queryClient.ensureQueryData(userOptions)                   │
  │                                                                                 │
  │   // FIRE & FORGET - start fetches, don't wait                                  │
  │   queryClient.prefetchQuery(appointmentsOptions)                                │
  │   queryClient.prefetchQuery(unfinishedNotesOptions)                             │
  │                                                                                 │
  │   return { user }                                                               │
  │                                                                                 │
  └─────────────────────────────────────────────────────────────────────────────────┘

  COMPONENT:
  ┌─────────────────────────────────────────────────────────────────────────────────┐
  │                                                                                 │
  │   <Header user={user} />              ◄─── has data (was awaited)               │
  │                                                                                 │
  │   <Suspense fallback={<BannerSkeleton />}>                                      │
  │     <UnfinishedNotes />               ◄─── useSuspenseQuery (loads independently)
  │   </Suspense>                                                                   │
  │                                                                                 │
  │   <Suspense fallback={<ScheduleSkeleton />}>                                    │
  │     <Schedule />                      ◄─── useSuspenseQuery (loads independently)
  │   </Suspense>                                                                   │
  │                                                                                 │
  └─────────────────────────────────────────────────────────────────────────────────┘


  PATIENT SELECTED (/patient/:id route)
  ═══════════════════════════════════════════════════════════════════════════════════

  LOADER:
  ┌─────────────────────────────────────────────────────────────────────────────────┐
  │                                                                                 │
  │   // BLOCKING - patient header is critical                                      │
  │   const patient = await getPatientProfileServerFn({ patientId })                │
  │                                                                                 │
  │   // FIRE & FORGET - notes can load after                                       │
  │   queryClient.prefetchQuery(patientNotesOptions(patientId))                     │
  │                                                                                 │
  │   return { patient }                                                            │
  │                                                                                 │
  └─────────────────────────────────────────────────────────────────────────────────┘

  COMPONENT:
  ┌─────────────────────────────────────────────────────────────────────────────────┐
  │                                                                                 │
  │   <PatientHeader patient={patient} />  ◄─── has data (was awaited via server fn)│
  │                                                                                 │
  │   <Suspense fallback={<NotesSkeleton />}>                                       │
  │     <PatientNotes patientId={id} />    ◄─── useSuspenseQuery (loads independently)
  │   </Suspense>                                                                   │
  │                                                                                 │
  └─────────────────────────────────────────────────────────────────────────────────┘


  HOVER APPOINTMENT (prefetch for instant navigation)
  ═══════════════════════════════════════════════════════════════════════════════════

  ┌─────────────────────────────────────────────────────────────────────────────────┐
  │                                                                                 │
  │   <AppointmentCard                                                              │
  │     onMouseEnter={() => {                                                       │
  │       queryClient.prefetchQuery(patientOptions(patientId))                      │
  │       queryClient.prefetchQuery(patientNotesOptions(patientId))                 │
  │     }}                                                                          │
  │   />                                                                            │
  │                                                                                 │
  │   // When user clicks → data already in cache → instant render                  │
  │                                                                                 │
  └─────────────────────────────────────────────────────────────────────────────────┘

  Patterns Summary (Corrected)
  ┌───────────────────┬────────────────────────────┬──────────────────────────────────┬────────────────────────────────────────────────────┐
  │      Pattern      │           Loader           │            Component             │                    What happens                    │
  ├───────────────────┼────────────────────────────┼──────────────────────────────────┼────────────────────────────────────────────────────┤
  │ Blocking          │ await ensureQueryData()    │ Direct prop                      │ Page waits, data guaranteed                        │
  ├───────────────────┼────────────────────────────┼──────────────────────────────────┼────────────────────────────────────────────────────┤
  │ Fire & Forget     │ prefetchQuery() (no await) │ useSuspenseQuery() in <Suspense> │ Loader returns fast, component loads independently │
  ├───────────────────┼────────────────────────────┼──────────────────────────────────┼────────────────────────────────────────────────────┤
  │ Server Function   │ await serverFn()           │ Direct prop                      │ Runs on server, filters data, page waits           │
  ├───────────────────┼────────────────────────────┼──────────────────────────────────┼────────────────────────────────────────────────────┤
  │ Prefetch on Hover │ —                          │ prefetchQuery() on hover         │ Warms cache before click                           │
  ├───────────────────┼────────────────────────────┼──────────────────────────────────┼────────────────────────────────────────────────────┤
  │ Search            │ —                          │ Server function + debounce       │ User types → server searches                       │
  └───────────────────┴────────────────────────────┴──────────────────────────────────┴────────────────────────────────────────────────────┘
  Does this capture what you wanted to demonstrate?
