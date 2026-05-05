import { queryOptions } from '@tanstack/react-query'
import type { User, Post, Comment, ApiResponse } from './types'

// API runs on localhost:3069 - this works from the SERVER
// because server loaders execute on the server, not the browser
const API_BASE = 'http://localhost:3069/api'

// ═══════════════════════════════════════════════════════════════════════════
// Fetch functions - these run on the SERVER during SSR
// The server makes these requests, NOT the browser!
// ═══════════════════════════════════════════════════════════════════════════

export async function fetchUser(userId: number, delay = 800): Promise<User> {
  const response = await fetch(`${API_BASE}/users/${userId}?delay=${delay}`)
  if (!response.ok) throw new Error('Failed to fetch user')
  const json = (await response.json()) as ApiResponse<User>
  return json.data
}

export async function fetchUsers(delay = 800): Promise<User[]> {
  const response = await fetch(`${API_BASE}/users?delay=${delay}`)
  if (!response.ok) throw new Error('Failed to fetch users')
  const json = (await response.json()) as ApiResponse<User[]>
  return json.data
}

export async function fetchUserPosts(userId: number, delay = 800): Promise<Post[]> {
  const response = await fetch(`${API_BASE}/users/${userId}/posts?delay=${delay}`)
  if (!response.ok) throw new Error('Failed to fetch user posts')
  const json = (await response.json()) as ApiResponse<Post[]>
  return json.data
}

export async function fetchPostComments(postId: number, delay = 800): Promise<Comment[]> {
  const response = await fetch(`${API_BASE}/posts/${postId}/comments?delay=${delay}`)
  if (!response.ok) throw new Error('Failed to fetch post comments')
  const json = (await response.json()) as ApiResponse<Comment[]>
  return json.data
}

// ═══════════════════════════════════════════════════════════════════════════
// Query options - used with ensureQueryData in server loaders
// ═══════════════════════════════════════════════════════════════════════════

export const userQueryOptions = (userId: number) =>
  queryOptions({
    queryKey: ['user', userId] as const,
    queryFn: () => fetchUser(userId),
  })

export const usersQueryOptions = () =>
  queryOptions({
    queryKey: ['users'] as const,
    queryFn: () => fetchUsers(),
  })

export const userPostsQueryOptions = (userId: number) =>
  queryOptions({
    queryKey: ['posts', userId] as const,
    queryFn: () => fetchUserPosts(userId),
  })

export const postCommentsQueryOptions = (postId: number) =>
  queryOptions({
    queryKey: ['comments', postId] as const,
    queryFn: () => fetchPostComments(postId),
  })
