export function Skeleton({ count = 1, height = 60 }: { count?: number; height?: number }) {
  return (
    <div className="skeleton-container">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="skeleton"
          style={{ height: `${height}px` }}
        />
      ))}
    </div>
  )
}
