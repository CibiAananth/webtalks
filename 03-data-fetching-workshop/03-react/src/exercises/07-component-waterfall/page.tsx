import { useState, useEffect } from "react";
import { useNetwork } from "../../context/NetworkContext";
import RequestLog from "../../components/RequestLog";
import WaterfallChart from "../../components/WaterfallChart";
import Skeleton from "../../components/Skeleton";
import UserCard from "../../components/UserCard";
import PostCard from "../../components/PostCard";
import CommentCard from "../../components/CommentCard";
import type { User, Post, Comment } from "../../types";

const API_BASE = "http://localhost:3069/api";

// ── COMPONENT-LEVEL FETCHING (the waterfall) ─────────────────

// Each component fetches its own data in useEffect.
// The child doesn't mount until the parent renders.
// This creates a waterfall: User → Posts → Comments (sequential).

interface WaterfallBar {
  label: string;
  start: number;
  duration: number;
  color: string;
}

// Shared ref to track waterfall timing across components
let waterfallStart = 0;
let waterfallBars: WaterfallBar[] = [];

function UserInfo({ userId }: { userId: number }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { trackedFetch } = useNetwork();

  useEffect(() => {
    setIsLoading(true);
    const start = Date.now();

    trackedFetch(API_BASE + "/users/" + userId + "?delay=800")
      .then(r => r.json())
      .then(data => {
        waterfallBars.push({
          label: "GET /users/" + userId,
          start: start - waterfallStart,
          duration: Date.now() - start,
          color: "#6c63ff",
        });
        setUser(data.data);
        setIsLoading(false);
      });
  }, [userId, trackedFetch]);

  if (isLoading) return <Skeleton count={1} height={100} />;
  if (!user) return null;

  return (
    <div>
      <UserCard user={user} />
      {/* UserPosts renders HERE — inside UserInfo, AFTER user loads */}
      <UserPosts userId={user.id} />
    </div>
  );
}

function UserPosts({ userId }: { userId: number }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { trackedFetch } = useNetwork();

  useEffect(() => {
    setIsLoading(true);
    const start = Date.now();

    trackedFetch(API_BASE + "/users/" + userId + "/posts?delay=800")
      .then(r => r.json())
      .then(data => {
        waterfallBars.push({
          label: "GET /users/" + userId + "/posts",
          start: start - waterfallStart,
          duration: Date.now() - start,
          color: "#4ade80",
        });
        setPosts(data.data);
        setIsLoading(false);
      });
  }, [userId, trackedFetch]);

  if (isLoading) return <Skeleton count={2} height={60} />;

  return (
    <div style={{ marginTop: "1rem" }}>
      <h3 style={{ marginBottom: "0.75rem" }}>Posts</h3>
      {posts.map((post, index) => (
        <div key={post.id}>
          <PostCard post={post} />
          {/* PostComments renders INSIDE UserPosts, AFTER posts load */}
          {index === 0 && <PostComments postId={post.id} />}
        </div>
      ))}
    </div>
  );
}

function PostComments({ postId }: { postId: number }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { trackedFetch } = useNetwork();

  useEffect(() => {
    setIsLoading(true);
    const start = Date.now();

    trackedFetch(API_BASE + "/posts/" + postId + "/comments?delay=800")
      .then(r => r.json())
      .then(data => {
        waterfallBars.push({
          label: "GET /posts/" + postId + "/comments",
          start: start - waterfallStart,
          duration: Date.now() - start,
          color: "#fbbf24",
        });
        setComments(data.data);
        setIsLoading(false);
      });
  }, [postId, trackedFetch]);

  if (isLoading) return <Skeleton count={2} height={40} />;

  return (
    <div style={{ marginTop: "0.75rem", paddingLeft: "1rem", borderLeft: "2px solid var(--border)" }}>
      <h4 style={{ marginBottom: "0.5rem", color: "var(--text-muted)" }}>Comments</h4>
      {comments.map(comment => (
        <CommentCard key={comment.id} comment={comment} />
      ))}
    </div>
  );
}


export default function Exercise07() {
  const [bars, setBars] = useState<WaterfallBar[]>([]);
  const [totalTime, setTotalTime] = useState(0);
  const [key, setKey] = useState(0);

  function handleLoad() {
    waterfallStart = Date.now();
    waterfallBars = [];
    setBars([]);
    setTotalTime(0);
    setKey(k => k + 1);
  }

  // Poll for waterfall updates (hacky but works for the demo)
  useEffect(() => {
    if (key === 0) return;
    const interval = setInterval(() => {
      setBars([...waterfallBars]);
      if (waterfallBars.length >= 3) {
        const lastBar = waterfallBars[waterfallBars.length - 1];
        if (lastBar) {
          setTotalTime(lastBar.start + lastBar.duration);
        }
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [key]);

  return (
    <div className="exercise-container">
      <h1><span className="accent">07.</span> The Component Waterfall</h1>
      <p className="description">
        Three nested components, each fetching their own data.
        Watch what happens when the child can't start until the parent finishes.
      </p>

      <RequestLog />

      <div style={{ margin: "1.5rem 0" }}>
        <button className="btn-primary" onClick={handleLoad}>
          {key === 0 ? "Load Profile" : "Reload"}
        </button>
      </div>

      <WaterfallChart bars={bars} totalTime={totalTime || 1} />

      <div style={{ marginTop: "0.75rem", fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--text-muted)" }}>
        Component tree: {"<UserInfo>"} → {"<UserPosts>"} → {"<PostComments>"}
        &nbsp;|&nbsp; Each child mounts only after its parent renders
      </div>

      {key > 0 && (
        <div className="workspace" style={{ marginTop: "1.5rem" }}>
          <UserInfo key={key} userId={1} />
        </div>
      )}

      <div className="insight-box" style={{ marginTop: "2rem" }}>
        <h3>Why can't we just use Promise.all?</h3>
        <p>
          In Exercise 04, you parallelized independent requests at the same level.
          But here, <code>{"<UserPosts>"}</code> literally doesn't <strong>exist</strong> until{" "}
          <code>{"<UserInfo>"}</code> renders it. React can't run a component's useEffect
          if the component hasn't mounted yet. The waterfall is baked into the component tree.
        </p>
        <p style={{ marginTop: "0.75rem" }}>
          The fix? Move the fetching OUTSIDE the component tree. Fetch at the page level
          (Exercise 08), or at the route level (Session 06). That's next.
        </p>
      </div>
    </div>
  );
}
