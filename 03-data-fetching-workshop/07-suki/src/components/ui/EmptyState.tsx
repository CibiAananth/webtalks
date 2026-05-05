import { cn } from '../../lib/utils'

type EmptyStateProps = {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--line)] bg-[var(--surface)] p-8 text-center',
        className
      )}
    >
      {icon && (
        <div className="mb-3 text-[var(--sea-ink-soft)]">{icon}</div>
      )}
      <h3 className="text-sm font-semibold text-[var(--sea-ink)]">{title}</h3>
      {description && (
        <p className="mt-1 text-sm text-[var(--sea-ink-soft)]">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
