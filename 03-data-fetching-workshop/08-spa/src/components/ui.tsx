import { cn } from '../lib/utils'

// ════════════════════════════════════════════════════════════════════════════════
// SKELETON
// ════════════════════════════════════════════════════════════════════════════════

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded bg-[var(--line)]', className)} />
}

export function SkeletonCard() {
  return (
    <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] p-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>
    </div>
  )
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 rounded-lg p-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="flex-1 space-y-1">
            <Skeleton className="h-3 w-3/4" />
            <Skeleton className="h-2 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════════
// SECTION
// ════════════════════════════════════════════════════════════════════════════════

export function Section({
  title,
  description,
  children,
  action,
}: {
  title: string
  description?: string
  children: React.ReactNode
  action?: React.ReactNode
}) {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-[var(--sea-ink)]">{title}</h3>
          {description && (
            <p className="text-xs text-[var(--sea-ink-soft)]">{description}</p>
          )}
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}

// ════════════════════════════════════════════════════════════════════════════════
// CARD
// ════════════════════════════════════════════════════════════════════════════════

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('rounded-xl border border-[var(--line)] bg-[var(--surface-strong)]', className)}>
      {children}
    </div>
  )
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('p-4', className)}>{children}</div>
}

// ════════════════════════════════════════════════════════════════════════════════
// ERROR DISPLAY
// ════════════════════════════════════════════════════════════════════════════════

export function ErrorDisplay({ title, message }: { title?: string; message: string }) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
      {title && <p className="font-semibold">{title}</p>}
      <p>{message}</p>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════════
// STATS CARD
// ════════════════════════════════════════════════════════════════════════════════

export function StatsCard({
  title,
  stats,
}: {
  title: string
  stats: Array<{ label: string; value: number | string; variant?: 'default' | 'success' | 'warning' | 'info' }>
}) {
  const variantStyles = {
    default: 'text-[var(--sea-ink)]',
    success: 'text-emerald-600',
    warning: 'text-amber-600',
    info: 'text-blue-600',
  }

  return (
    <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] p-4">
      <h4 className="mb-3 text-sm font-semibold text-[var(--sea-ink)]">{title}</h4>
      <div className="space-y-1">
        {stats.map((stat, i) => (
          <div key={i} className="flex items-center justify-between py-1">
            <span className="text-sm text-[var(--sea-ink-soft)]">{stat.label}</span>
            <span className={cn('font-semibold tabular-nums', variantStyles[stat.variant ?? 'default'])}>
              {stat.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function StatsCardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] p-4">
      <Skeleton className="mb-3 h-4 w-24" />
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center justify-between">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-4 w-8" />
          </div>
        ))}
      </div>
    </div>
  )
}
