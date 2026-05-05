import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/exercise')({
  component: ExerciseLayout,
})

function ExerciseLayout() {
  return (
    <div className="exercise-container">
      <Outlet />
    </div>
  )
}
