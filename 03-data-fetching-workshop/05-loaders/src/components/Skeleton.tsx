interface SkeletonProps {
  count?: number
  height?: number
}

export default function Skeleton({ count = 3, height = 76 }: SkeletonProps) {
  return (
    <div style={{ display: 'grid', gap: '0.75rem' }}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="skeleton" style={{ height }} />
      ))}
    </div>
  )
}
