import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'

const srcDir = join(__dirname, '..')
const routesDir = join(srcDir, 'routes')

function readRouteFile(path: string): string {
  return readFileSync(join(routesDir, path), 'utf-8')
}

describe('Session 05: Route Loaders', () => {
  describe('Demo routes', () => {
    it('demo/suspense.tsx uses Suspense hooks and boundaries', () => {
      const content = readRouteFile('demo/suspense.tsx')
      expect(content).toContain('Suspense')
      expect(content).toContain('useUserSuspense')
      expect(content).toContain('useUserPostsSuspense')
      // Uses Suspense boundaries
      expect(content).toContain('<Suspense fallback=')
    })

    it('demo/with-loader.tsx has a loader with ensureQueryData', () => {
      const content = readRouteFile('demo/with-loader.tsx')
      expect(content).toContain('loader:')
      expect(content).toContain('ensureQueryData')
      expect(content).toContain('Promise.all')
    })
  })

  describe('Exercise routes', () => {
    it('exercise/users.$userId.tsx does NOT have an active loader', () => {
      const content = readRouteFile('exercise/users.$userId.tsx')
      // Should have the exercise comment
      expect(content).toContain('ADD YOUR LOADER HERE')
      // Should have the loader template as a COMMENT (not active)
      expect(content).toContain('// loader: async')
      // The route config should NOT have an active loader
      expect(content).not.toMatch(/^\s*loader:\s*async/m)
    })

    it('exercise/users_.$userId.solution.tsx HAS a loader with ensureQueryData', () => {
      const content = readRouteFile('exercise/users_.$userId.solution.tsx')
      expect(content).toContain('loader:')
      expect(content).toContain('ensureQueryData')
      expect(content).toContain('Promise.all')
      expect(content).toContain('pendingComponent')
    })
  })

  describe('Shared infrastructure', () => {
    it('hooks.ts has the required hooks', () => {
      const content = readFileSync(join(srcDir, 'hooks.ts'), 'utf-8')
      expect(content).toContain('useUser')
      expect(content).toContain('useUserPosts')
      expect(content).toContain('usePostComments')
      expect(content).toContain('useUserSuspense')
      expect(content).toContain('useUserPostsSuspense')
    })

    it('api.ts has the required fetch functions', () => {
      const content = readFileSync(join(srcDir, 'api.ts'), 'utf-8')
      expect(content).toContain('fetchUser')
      expect(content).toContain('fetchUsers')
      expect(content).toContain('fetchUserPosts')
      expect(content).toContain('fetchPostComments')
      expect(content).toContain('userQueryOptions')
      expect(content).toContain('userPostsQueryOptions')
    })
  })
})
