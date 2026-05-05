import type { User, Post, Comment, ApiResponse } from './types'

const API_BASE = 'http://localhost:3069/api'

// ═══════════════════════════════════════════════════════════════════════════
// Standard fetch functions (for use in components and loaders)
// ═══════════════════════════════════════════════════════════════════════════

export async function fetchUser(userId: number, delay = 800): Promise<User> {
  const response = await fetch(`${API_BASE}/users/${userId}?delay=${delay}`)
  const json = (await response.json()) as ApiResponse<User>
  return json.data
}

export async function fetchUsers(delay = 800): Promise<User[]> {
  const response = await fetch(`${API_BASE}/users?delay=${delay}`)
  const json = (await response.json()) as ApiResponse<User[]>
  return json.data
}

export async function fetchUserPosts(userId: number, delay = 800): Promise<Post[]> {
  const response = await fetch(`${API_BASE}/users/${userId}/posts?delay=${delay}`)
  const json = (await response.json()) as ApiResponse<Post[]>
  return json.data
}

export async function fetchPostComments(postId: number, delay = 800): Promise<Comment[]> {
  const response = await fetch(`${API_BASE}/posts/${postId}/comments?delay=${delay}`)
  const json = (await response.json()) as ApiResponse<Comment[]>
  return json.data
}

// ═══════════════════════════════════════════════════════════════════════════
// Query options factories (for use with queryClient.ensureQueryData)
// ═══════════════════════════════════════════════════════════════════════════

export const userQueryOptions = (userId: number) => ({
  queryKey: ['user', userId] as const,
  queryFn: () => fetchUser(userId),
})

export const usersQueryOptions = () => ({
  queryKey: ['users'] as const,
  queryFn: () => fetchUsers(),
})

export const userPostsQueryOptions = (userId: number) => ({
  queryKey: ['posts', userId] as const,
  queryFn: () => fetchUserPosts(userId),
})

export const postCommentsQueryOptions = (postId: number) => ({
  queryKey: ['comments', postId] as const,
  queryFn: () => fetchPostComments(postId),
})
