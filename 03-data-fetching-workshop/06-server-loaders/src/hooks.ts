import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import {
  userQueryOptions,
  usersQueryOptions,
  userPostsQueryOptions,
  postCommentsQueryOptions,
} from './api'

// ═══════════════════════════════════════════════════════════════════════════
// Regular useQuery hooks
// ═══════════════════════════════════════════════════════════════════════════

export function useUser(userId: number) {
  return useQuery(userQueryOptions(userId))
}

export function useUsers() {
  return useQuery(usersQueryOptions())
}

export function useUserPosts(userId: number) {
  return useQuery(userPostsQueryOptions(userId))
}

export function usePostComments(postId: number) {
  return useQuery(postCommentsQueryOptions(postId))
}

// ═══════════════════════════════════════════════════════════════════════════
// Suspense hooks - same queryOptions, data guaranteed available
// ═══════════════════════════════════════════════════════════════════════════

export function useUserSuspense(userId: number) {
  return useSuspenseQuery(userQueryOptions(userId))
}

export function useUsersSuspense() {
  return useSuspenseQuery(usersQueryOptions())
}

export function useUserPostsSuspense(userId: number) {
  return useSuspenseQuery(userPostsQueryOptions(userId))
}

export function usePostCommentsSuspense(postId: number) {
  return useSuspenseQuery(postCommentsQueryOptions(postId))
}
