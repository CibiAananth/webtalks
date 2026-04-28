import { useState, useEffect } from "react";
import { useNetwork } from "../../context/NetworkContext";
import Skeleton from "../../components/Skeleton";
import UserCard from "../../components/UserCard";
import PostCard from "../../components/PostCard";
import CommentCard from "../../components/CommentCard";
import type { User, Post, Comment, ApiResponse } from "../../types";

const API_BASE = "http://localhost:3069/api";

interface WaterfallBar {
  label: string;
  start: number;
  duration: number;
  color: string;
}

function UserInfoDisplay({ user }: { user: User }) {
  return <UserCard user={user} />;
}

function UserPostsDisplay({ posts }: { posts: Post[] }) {
  return (
    <div style={{ marginTop: "1rem" }}>
      <h3 style={{ marginBottom: "0.75rem" }}>Posts</h3>
      {posts.map(post => <PostCard key={post.id} post={post} />)}
    </div>
  );
}

function PostCommentsDisplay({ comments }: { comments: Comment[] }) {
  return (
    <div style={{ marginTop: "0.75rem", paddingLeft: "1rem", borderLeft: "2px solid var(--border)" }}>
      <h4 style={{ marginBottom: "0.5rem", color: "var(--text-muted)" }}>Comments</h4>
      {comments.map(comment => <CommentCard key={comment.id} comment={comment} />)}
    </div>
  );
}

export default function ProfilePageSolution({ userId, onWaterfallUpdate }: {
  userId: number;
  onWaterfallUpdate: (bars: WaterfallBar[], total: number) => void;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { trackedFetch } = useNetwork();

  useEffect(() => {
    setIsLoading(true);
    const totalStart = Date.now();
    const bars: WaterfallBar[] = [];

    async function loadAll() {
      // Phase 1: user and posts in parallel
      const phase1Start = Date.now();
      const [userData, postsData] = await Promise.all([
        trackedFetch(API_BASE + "/users/" + userId + "?delay=800").then(r => r.json()) as Promise<ApiResponse<User>>,
        trackedFetch(API_BASE + "/users/" + userId + "/posts?delay=800").then(r => r.json()) as Promise<ApiResponse<Post[]>>,
      ]);
      const phase1Duration = Date.now() - phase1Start;

      bars.push({ label: "GET /users/" + userId, start: 0, duration: phase1Duration, color: "#6c63ff" });
      bars.push({ label: "GET /users/" + userId + "/posts", start: 0, duration: phase1Duration, color: "#4ade80" });

      setUser(userData.data);
      setPosts(postsData.data);

      // Phase 2: comments depend on first post ID
      if (postsData.data.length > 0) {
        const phase2Start = Date.now();
        const firstPost = postsData.data[0];
        if (firstPost) {
          const commentsData = await trackedFetch(
            API_BASE + "/posts/" + firstPost.id + "/comments?delay=800"
          ).then(r => r.json()) as ApiResponse<Comment[]>;
          const phase2Duration = Date.now() - phase2Start;

          bars.push({
            label: "GET /posts/" + firstPost.id + "/comments",
            start: phase2Start - totalStart,
            duration: phase2Duration,
            color: "#fbbf24",
          });

          setComments(commentsData.data);
        }
      }

      setIsLoading(false);
      onWaterfallUpdate(bars, Date.now() - totalStart);
    }

    loadAll();
  }, [userId, trackedFetch, onWaterfallUpdate]);

  if (isLoading) return <Skeleton count={5} height={60} />;

  return (
    <div>
      {user && <UserInfoDisplay user={user} />}
      {posts.length > 0 && <UserPostsDisplay posts={posts} />}
      {posts.length > 0 && comments.length > 0 && (
        <PostCommentsDisplay comments={comments} />
      )}
    </div>
  );
}
