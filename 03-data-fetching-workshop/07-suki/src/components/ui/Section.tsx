import { cn } from '../../lib/utils'

type SectionProps = {
  title: string
  description?: string
  action?: React.ReactNode
  children: React.ReactNode
  className?: string
}

export function Section({
  title,
  description,
  action,
  children,
  className,
}: SectionProps) {
  return (
    <section className={cn('', className)}>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[var(--sea-ink)]">{title}</h2>
          {description && (
            <p className="mt-0.5 text-sm text-[var(--sea-ink-soft)]">
              {description}
            </p>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>
      {children}
    </section>
  )
}
