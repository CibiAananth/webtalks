import { useState } from 'react'
import type { Patient } from '../../api'
import { cn } from '../../lib/utils'
import { Skeleton } from '../ui/Skeleton'
import { PatientCardCompact } from './PatientCard'

type PatientSearchInputProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function PatientSearchInput({
  value,
  onChange,
  placeholder = 'Search patients...',
  className,
}: PatientSearchInputProps) {
  return (
    <div className={cn('relative', className)}>
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <svg
          className="h-4 w-4 text-[var(--sea-ink-soft)]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-[var(--line)] bg-[var(--surface-strong)] py-2 pl-10 pr-4 text-sm text-[var(--sea-ink)] placeholder-[var(--sea-ink-soft)] focus:border-[var(--lagoon)] focus:outline-none focus:ring-1 focus:ring-[var(--lagoon)]"
      />
    </div>
  )
}

type PatientSearchResultsProps = {
  results: Patient[]
  isLoading?: boolean
  onPatientSelect: (patient: Patient) => void
  className?: string
}

export function PatientSearchResults({
  results,
  isLoading,
  onPatientSelect,
  className,
}: PatientSearchResultsProps) {
  if (isLoading) {
    return (
      <div className={cn('space-y-1', className)}>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-2 p-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className={cn('p-4 text-center text-sm text-[var(--sea-ink-soft)]', className)}>
        No patients found
      </div>
    )
  }

  return (
    <div className={cn('space-y-1', className)}>
      {results.map((patient) => (
        <PatientCardCompact
          key={patient.id}
          patient={patient}
          onClick={() => onPatientSelect(patient)}
        />
      ))}
    </div>
  )
}

type PatientSearchProps = {
  onPatientSelect: (patient: Patient) => void
  searchFn: (query: string) => Promise<{ results: Patient[] }>
  className?: string
}

export function PatientSearch({
  onPatientSelect,
  searchFn,
  className,
}: PatientSearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Patient[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)

  const handleSearch = async (value: string) => {
    setQuery(value)
    if (value.length < 2) {
      setResults([])
      setShowResults(false)
      return
    }

    setIsLoading(true)
    setShowResults(true)
    try {
      const data = await searchFn(value)
      setResults(data.results)
    } catch (error) {
      console.error('Search failed:', error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelect = (patient: Patient) => {
    onPatientSelect(patient)
    setQuery('')
    setResults([])
    setShowResults(false)
  }

  return (
    <div className={cn('relative', className)}>
      <PatientSearchInput value={query} onChange={handleSearch} />
      {showResults && (
        <div className="absolute left-0 right-0 top-full z-10 mt-1 max-h-64 overflow-auto rounded-lg border border-[var(--line)] bg-[var(--surface-strong)] shadow-lg">
          <PatientSearchResults
            results={results}
            isLoading={isLoading}
            onPatientSelect={handleSelect}
          />
        </div>
      )}
    </div>
  )
}
