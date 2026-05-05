import { cn } from '../../lib/utils'

type StatItemProps = {
  label: string
  value: number | string
  variant?: 'default' | 'success' | 'warning' | 'info'
}

function StatItem({ label, value, variant = 'default' }: StatItemProps) {
  const variantStyles = {
    default: 'text-[var(--sea-ink)]',
    success: 'text-emerald-600',
    warning: 'text-amber-600',
    info: 'text-blue-600',
  }

  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-sm text-[var(--sea-ink-soft)]">{label}</span>
      <span className={cn('font-semibold tabular-nums', variantStyles[variant])}>{value}</span>
    </div>
  )
}

type StatsCardProps = {
  title: string
  stats: Array<{
    label: string
    value: number | string
    variant?: 'default' | 'success' | 'warning' | 'info'
  }>
  className?: string
}

export function StatsCard({ title, stats, className }: StatsCardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] p-4',
        className
      )}
    >
      <h4 className="mb-3 text-sm font-semibold text-[var(--sea-ink)]">{title}</h4>
      <div className="space-y-1 divide-y divide-[var(--line)]">
        {stats.map((stat, i) => (
          <StatItem key={i} {...stat} />
        ))}
      </div>
    </div>
  )
}

export function StatsCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] p-4',
        className
      )}
    >
      <div className="mb-3 h-4 w-24 rounded bg-[var(--line)]" />
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="h-3 w-20 rounded bg-[var(--line)]" />
            <div className="h-4 w-8 rounded bg-[var(--line)]" />
          </div>
        ))}
      </div>
    </div>
  )
}
