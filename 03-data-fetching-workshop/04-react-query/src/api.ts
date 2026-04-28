import type { User, Post, Comment, ApiResponse } from "./types";

const API_BASE = "http://localhost:3069/api";

export async function fetchUser(userId: number, delay = 800): Promise<User> {
  const response = await fetch(`${API_BASE}/users/${userId}?delay=${delay}`);
  const json = (await response.json()) as ApiResponse<User>;
  return json.data;
}

export async function fetchUsers(delay = 800): Promise<User[]> {
  const response = await fetch(`${API_BASE}/users?delay=${delay}`);
  const json = (await response.json()) as ApiResponse<User[]>;
  return json.data;
}

export async function fetchUserPosts(userId: number, delay = 800): Promise<Post[]> {
  const response = await fetch(`${API_BASE}/users/${userId}/posts?delay=${delay}`);
  const json = (await response.json()) as ApiResponse<Post[]>;
  return json.data;
}

export async function fetchPostComments(postId: number, delay = 800): Promise<Comment[]> {
  const response = await fetch(`${API_BASE}/posts/${postId}/comments?delay=${delay}`);
  const json = (await response.json()) as ApiResponse<Comment[]>;
  return json.data;
}

// Tracked versions for request logging
export function createTrackedFetchers(trackedFetch: (url: string, options?: RequestInit) => Promise<Response>) {
  return {
    fetchUser: async (userId: number, delay = 800): Promise<User> => {
      const response = await trackedFetch(`${API_BASE}/users/${userId}?delay=${delay}`);
      const json = (await response.json()) as ApiResponse<User>;
      return json.data;
    },

    fetchUsers: async (delay = 800): Promise<User[]> => {
      const response = await trackedFetch(`${API_BASE}/users?delay=${delay}`);
      const json = (await response.json()) as ApiResponse<User[]>;
      return json.data;
    },

    fetchUserPosts: async (userId: number, delay = 800): Promise<Post[]> => {
      const response = await trackedFetch(`${API_BASE}/users/${userId}/posts?delay=${delay}`);
      const json = (await response.json()) as ApiResponse<Post[]>;
      return json.data;
    },

    fetchPostComments: async (postId: number, delay = 800): Promise<Comment[]> => {
      const response = await trackedFetch(`${API_BASE}/posts/${postId}/comments?delay=${delay}`);
      const json = (await response.json()) as ApiResponse<Comment[]>;
      return json.data;
    },
  };
}
