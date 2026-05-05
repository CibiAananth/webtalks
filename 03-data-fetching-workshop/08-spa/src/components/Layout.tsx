import { Outlet, NavLink } from 'react-router-dom'

export function Layout() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[var(--header-bg)] px-4 backdrop-blur-lg">
        <nav className="page-wrap flex items-center gap-4 py-3">
          <h2 className="m-0 text-base font-semibold">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-3 py-1.5 text-sm text-[var(--sea-ink)]">
              <span className="h-2 w-2 rounded-full bg-orange-400" />
              SPA Demo
            </span>
          </h2>

          <div className="flex items-center gap-2 text-sm font-medium">
            <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Home
            </NavLink>
            <NavLink to="/demo" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Demo
            </NavLink>
          </div>

          <span className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-orange-300 bg-orange-100 px-2.5 py-1 text-xs font-medium text-orange-700">
            <span className="h-2 w-2 rounded-full bg-orange-500" />
            Client-Only SPA
          </span>
        </nav>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  )
}
