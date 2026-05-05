import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import {
  fetchUser,
  fetchUsers,
  fetchUserPosts,
  fetchPostComments,
  userQueryOptions,
  usersQueryOptions,
  userPostsQueryOptions,
  postCommentsQueryOptions,
} from './api'
import type { User, Post, Comment } from './types'

// ═══════════════════════════════════════════════════════════════════════════
// useQuery hooks (non-suspense, with loading states)
// ═══════════════════════════════════════════════════════════════════════════

export function useUser(userId: number) {
  return useQuery<User>(userQueryOptions(userId))
}

export function useUsers() {
  return useQuery<User[]>(usersQueryOptions())
}

export function useUserPosts(userId: number) {
  return useQuery<Post[]>(userPostsQueryOptions(userId))
}

export function usePostComments(postId: number | undefined) {
  return useQuery<Comment[]>({
    ...postCommentsQueryOptions(postId!),
    enabled: postId !== undefined,
  })
}

// ═══════════════════════════════════════════════════════════════════════════
// useSuspenseQuery hooks (for use with Suspense boundaries)
// ═══════════════════════════════════════════════════════════════════════════

export function useUserSuspense(userId: number) {
  return useSuspenseQuery<User>(userQueryOptions(userId))
}

export function useUsersSuspense() {
  return useSuspenseQuery<User[]>(usersQueryOptions())
}

export function useUserPostsSuspense(userId: number) {
  return useSuspenseQuery<Post[]>(userPostsQueryOptions(userId))
}

export function usePostCommentsSuspense(postId: number) {
  return useSuspenseQuery<Comment[]>(postCommentsQueryOptions(postId))
}
