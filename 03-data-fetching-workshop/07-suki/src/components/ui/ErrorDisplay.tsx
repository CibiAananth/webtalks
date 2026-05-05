import { cn } from '../../lib/utils'

type ErrorDisplayProps = {
  title?: string
  message: string
  retry?: () => void
  className?: string
}

export function ErrorDisplay({
  title = 'Something went wrong',
  message,
  retry,
  className,
}: ErrorDisplayProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/30',
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 text-red-500">
          <svg
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-red-800 dark:text-red-200">
            {title}
          </h3>
          <p className="mt-1 text-sm text-red-700 dark:text-red-300">
            {message}
          </p>
          {retry && (
            <button
              type="button"
              onClick={retry}
              className="mt-3 text-sm font-medium text-red-600 hover:text-red-500 dark:text-red-400"
            >
              Try again
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
