export interface User {
  id: number
  name: string
  email: string
  role: string
  avatar: string
  joined?: string
  // Sensitive fields (exposed in API response)
  stripeCustomerId?: string
  lastLoginIp?: string
  sessionToken?: string
  internalDatabaseId?: string
  // Stats (from server function aggregation)
  stats?: {
    totalLogins: number
    documentsCreated: number
    apiCallsThisMonth: number
  }
}

export interface Post {
  id: number
  userId: number
  title: string
  body: string
  createdAt?: string
}

export interface Comment {
  id: number
  postId: number
  author: string
  text: string
}

export interface ApiResponse<T> {
  data: T
}
