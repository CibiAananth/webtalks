import { useState, useEffect } from 'react'
import { cn } from '../../lib/utils'

type RenderType = 'ssr' | 'client' | 'hydrating'

/**
 * Visual indicator showing how the page was rendered.
 *
 * DEMO INSTRUCTIONS:
 * 1. Full SSR: Hard refresh (Cmd+Shift+R) or type URL directly
 *    - Shows "SSR" badge briefly, then "Hydrated"
 *    - Network tab: Full HTML document returned
 *
 * 2. Client Navigation: Click a <Link> from another page
 *    - Shows "Client" badge
 *    - Network tab: Only JSON data fetched, no HTML
 *
 * 3. Hybrid: Initial page load is SSR, subsequent navigations are client
 */
export function RenderIndicator({ className }: { className?: string }) {
  // Start with 'ssr' - this will be true on server and initial client render
  const [renderType, setRenderType] = useState<RenderType>('ssr')
  const [timestamp] = useState(() => new Date().toISOString())

  useEffect(() => {
    // If we get here via useEffect, we're on the client
    // Check if this is a fresh SSR + hydration or a client navigation

    // Performance API can tell us if this was a navigation or a reload
    const navEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[]
    const navEntry = navEntries[0]

    if (navEntry) {
      // 'navigate' = client-side navigation (SPA)
      // 'reload' = hard refresh (full SSR)
      // 'back_forward' = browser back/forward
      const isClientNav = navEntry.type === 'navigate' &&
        // Check if the page was already in memory (client navigation)
        performance.now() < 1000 // If we hydrate within 1s, it was SSR

      if (navEntry.type === 'reload') {
        setRenderType('ssr') // Full page reload = SSR
      } else if (isClientNav && renderType === 'ssr') {
        // We had 'ssr' state but this is actually hydration
        setRenderType('ssr')
      }
    }

    // Small delay to show the transition
    const timer = setTimeout(() => {
      // After hydration, check how we got here
      const wasClientNav = window.__TANSTACK_ROUTER_STATE__?.isTransitioning === false
      setRenderType(wasClientNav ? 'client' : 'ssr')
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  const variants: Record<RenderType, { bg: string; text: string; label: string }> = {
    ssr: {
      bg: 'bg-purple-100 border-purple-300',
      text: 'text-purple-700',
      label: 'SSR'
    },
    client: {
      bg: 'bg-blue-100 border-blue-300',
      text: 'text-blue-700',
      label: 'Client Nav'
    },
    hydrating: {
      bg: 'bg-amber-100 border-amber-300',
      text: 'text-amber-700',
      label: 'Hydrating...'
    },
  }

  const variant = variants[renderType]

  return (
    <div className={cn('inline-flex items-center gap-2', className)}>
      <span
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium',
          variant.bg,
          variant.text
        )}
      >
        <span className={cn(
          'h-2 w-2 rounded-full',
          renderType === 'ssr' ? 'bg-purple-500' :
          renderType === 'client' ? 'bg-blue-500' : 'bg-amber-500 animate-pulse'
        )} />
        {variant.label}
      </span>
      <span className="text-xs text-[var(--sea-ink-soft)]">
        {new Date(timestamp).toLocaleTimeString()}
      </span>
    </div>
  )
}

/**
 * Simple version that just shows SSR vs Client badge
 * Uses a more reliable detection method
 */
export function SimpleRenderIndicator({ className }: { className?: string }) {
  const [isClient, setIsClient] = useState(false)
  const [navType, setNavType] = useState<string>('')

  useEffect(() => {
    setIsClient(true)

    // Get navigation type
    const navEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[]
    if (navEntries[0]) {
      setNavType(navEntries[0].type)
    }
  }, [])

  // During SSR, this shows "Server"
  // After hydration, shows the actual navigation type
  const label = !isClient
    ? 'Server Rendering...'
    : navType === 'reload'
      ? 'SSR + Hydrated'
      : navType === 'navigate'
        ? 'Client Navigation'
        : navType === 'back_forward'
          ? 'Back/Forward'
          : 'Hydrated'

  const isSSR = !isClient || navType === 'reload'

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors',
        isSSR
          ? 'border-purple-300 bg-purple-100 text-purple-700'
          : 'border-blue-300 bg-blue-100 text-blue-700',
        className
      )}
    >
      <span className={cn(
        'h-2 w-2 rounded-full',
        isSSR ? 'bg-purple-500' : 'bg-blue-500'
      )} />
      {label}
    </span>
  )
}

// Type declaration for TanStack Router internals
declare global {
  interface Window {
    __TANSTACK_ROUTER_STATE__?: {
      isTransitioning?: boolean
    }
  }
}
