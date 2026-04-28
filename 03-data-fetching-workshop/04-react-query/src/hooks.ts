import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useNetwork } from "./context/NetworkContext";
import { createTrackedFetchers } from "./api";
import type { User, Post, Comment } from "./types";

// ═══════════════════════════════════════════════════════════════════════════
// useQuery hooks (non-suspense)
// ═══════════════════════════════════════════════════════════════════════════

export function useUser(userId: number, delay = 800) {
  const { trackedFetch } = useNetwork();
  const fetchers = createTrackedFetchers(trackedFetch);

  return useQuery<User>({
    queryKey: ["user", userId],
    queryFn: () => fetchers.fetchUser(userId, delay),
  });
}

export function useUserPosts(userId: number, delay = 800) {
  const { trackedFetch } = useNetwork();
  const fetchers = createTrackedFetchers(trackedFetch);

  return useQuery<Post[]>({
    queryKey: ["userPosts", userId],
    queryFn: () => fetchers.fetchUserPosts(userId, delay),
  });
}

export function usePostComments(postId: number | undefined, delay = 800) {
  const { trackedFetch } = useNetwork();
  const fetchers = createTrackedFetchers(trackedFetch);

  return useQuery<Comment[]>({
    queryKey: ["postComments", postId],
    queryFn: () => fetchers.fetchPostComments(postId!, delay),
    enabled: postId !== undefined,
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// useSuspenseQuery hooks
// ═══════════════════════════════════════════════════════════════════════════

export function useSuspenseUser(userId: number, delay = 2000) {
  const { trackedFetch } = useNetwork();
  const fetchers = createTrackedFetchers(trackedFetch);

  return useSuspenseQuery<User>({
    queryKey: ["user", userId],
    queryFn: () => fetchers.fetchUser(userId, delay),
  });
}

export function useSuspenseUserPosts(userId: number, delay = 1200) {
  const { trackedFetch } = useNetwork();
  const fetchers = createTrackedFetchers(trackedFetch);

  return useSuspenseQuery<Post[]>({
    queryKey: ["userPosts", userId],
    queryFn: () => fetchers.fetchUserPosts(userId, delay),
  });
}

export function useSuspensePostComments(postId: number, delay = 3000) {
  const { trackedFetch } = useNetwork();
  const fetchers = createTrackedFetchers(trackedFetch);

  return useSuspenseQuery<Comment[]>({
    queryKey: ["postComments", postId],
    queryFn: () => fetchers.fetchPostComments(postId, delay),
  });
}
