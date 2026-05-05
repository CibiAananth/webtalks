import { createFileRoute, Outlet } from '@tanstack/react-router'
import { SimpleRenderIndicator } from '../components'

export const Route = createFileRoute('/backup')({
  component: BackupLayout,
})

function BackupLayout() {
  return (
    <div className="page-wrap py-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--sea-ink)]">
            Data Fetching Patterns Demo
          </h1>
          <p className="mt-1 text-sm text-[var(--sea-ink-soft)]">
            Reference implementation showing blocking, streaming, suspense, and search patterns.
          </p>
        </div>
        <SimpleRenderIndicator />
      </div>
      <Outlet />
    </div>
  )
}
