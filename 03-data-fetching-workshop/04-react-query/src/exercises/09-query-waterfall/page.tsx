import { useState, useEffect, useCallback, Suspense } from "react";
import { useQueryClient } from "@tanstack/react-query";
import RequestLog from "../../components/RequestLog";
import WaterfallChart from "../../components/WaterfallChart";
import UserCard from "../../components/UserCard";
import PostCard from "../../components/PostCard";
import CommentCard from "../../components/CommentCard";
import Skeleton from "../../components/Skeleton";
import { useNetwork } from "../../context/NetworkContext";
import { useUser, useUserPosts, usePostComments } from "../../hooks";
import type { User, Post, Comment, ApiResponse } from "../../types";

const API_BASE = "http://localhost:3069/api";

interface WaterfallBar {
  label: string;
  start: number;
  duration: number;
  color: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// Tab 1: useEffect Pattern (from Session 03)
// Each component fetches when it mounts - WATERFALL
// ═══════════════════════════════════════════════════════════════════════════

function UseEffectUserInfo({
  userId,
  onUserLoaded,
  children,
}: {
  userId: number;
  onUserLoaded: () => void;
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { trackedFetch } = useNetwork();

  useEffect(() => {
    setIsLoading(true);
    trackedFetch(`${API_BASE}/users/${userId}?delay=800`)
      .then((r) => r.json())
      .then((data: ApiResponse<User>) => {
        setUser(data.data);
        setIsLoading(false);
        onUserLoaded();
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, trackedFetch]);

  if (isLoading) return <Skeleton count={1} height={80} />;
  if (!user) return null;

  return (
    <>
      <UserCard user={user} />
      {children}
    </>
  );
}

function UseEffectPosts({
  userId,
  onPostsLoaded,
  onFirstPostId,
}: {
  userId: number;
  onPostsLoaded: () => void;
  onFirstPostId: (postId: number) => void;
}) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { trackedFetch } = useNetwork();

  useEffect(() => {
    setIsLoading(true);
    trackedFetch(`${API_BASE}/users/${userId}/posts?delay=800`)
      .then((r) => r.json())
      .then((data: ApiResponse<Post[]>) => {
        setPosts(data.data);
        setIsLoading(false);
        onPostsLoaded();
        if (data.data[0]) {
          onFirstPostId(data.data[0].id);
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, trackedFetch]);

  if (isLoading) return <Skeleton count={2} height={60} />;

  return (
    <div style={{ marginTop: "1rem" }}>
      <h3 style={{ marginBottom: "0.75rem" }}>Posts</h3>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

function UseEffectComments({
  postId,
  onCommentsLoaded,
}: {
  postId: number;
  onCommentsLoaded: () => void;
}) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { trackedFetch } = useNetwork();

  useEffect(() => {
    setIsLoading(true);
    trackedFetch(`${API_BASE}/posts/${postId}/comments?delay=800`)
      .then((r) => r.json())
      .then((data: ApiResponse<Comment[]>) => {
        setComments(data.data);
        setIsLoading(false);
        onCommentsLoaded();
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId, trackedFetch]);

  if (isLoading) return <Skeleton count={2} height={40} />;

  return (
    <div
      style={{
        marginTop: "0.75rem",
        paddingLeft: "1rem",
        borderLeft: "2px solid var(--border)",
      }}
    >
      <h4 style={{ marginBottom: "0.5rem", color: "var(--text-muted)" }}>
        Comments
      </h4>
      {comments.map((comment) => (
        <CommentCard key={comment.id} comment={comment} />
      ))}
    </div>
  );
}

function UseEffectProfile({
  userId,
  onWaterfallUpdate,
}: {
  userId: number;
  onWaterfallUpdate: (bars: WaterfallBar[], total: number) => void;
}) {
  const [totalStart] = useState(Date.now());
  const [userLoaded, setUserLoaded] = useState(false);
  const [postsLoaded, setPostsLoaded] = useState(false);
  const [firstPostId, setFirstPostId] = useState<number | null>(null);
  const [userDuration, setUserDuration] = useState(0);
  const [postsDuration, setPostsDuration] = useState(0);

  const handleUserLoaded = useCallback(() => {
    const duration = Date.now() - totalStart;
    setUserDuration(duration);
    setUserLoaded(true);
  }, [totalStart]);

  const handlePostsLoaded = useCallback(() => {
    const duration = Date.now() - totalStart - userDuration;
    setPostsDuration(duration);
    setPostsLoaded(true);
  }, [totalStart, userDuration]);

  const handleFirstPostId = useCallback((postId: number) => {
    setFirstPostId(postId);
  }, []);

  const handleCommentsLoaded = useCallback(() => {
    const total = Date.now() - totalStart;
    const commentsStart = userDuration + postsDuration;
    const bars: WaterfallBar[] = [
      { label: `GET /users/${userId}`, start: 0, duration: userDuration, color: "#6c63ff" },
      { label: `GET /users/${userId}/posts`, start: userDuration, duration: postsDuration, color: "#4ade80" },
      { label: "GET /posts/1/comments", start: commentsStart, duration: total - commentsStart, color: "#fbbf24" },
    ];
    onWaterfallUpdate(bars, total);
  }, [userId, userDuration, postsDuration, totalStart, onWaterfallUpdate]);

  return (
    <UseEffectUserInfo userId={userId} onUserLoaded={handleUserLoaded}>
      {userLoaded && (
        <UseEffectPosts
          userId={userId}
          onPostsLoaded={handlePostsLoaded}
          onFirstPostId={handleFirstPostId}
        />
      )}
      {postsLoaded && firstPostId && (
        <UseEffectComments postId={firstPostId} onCommentsLoaded={handleCommentsLoaded} />
      )}
    </UseEffectUserInfo>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Tab 2: useQuery Pattern
// Same structure, just React Query instead of useEffect - STILL WATERFALL
// ═══════════════════════════════════════════════════════════════════════════

function QueryUserInfo({
  userId,
  onRenderChildren,
}: {
  userId: number;
  onRenderChildren: () => React.ReactNode;
}) {
  const { data: user, isLoading } = useUser(userId);

  if (isLoading) return <Skeleton count={1} height={80} />;
  if (!user) return null;

  return (
    <>
      <UserCard user={user} />
      {onRenderChildren()}
    </>
  );
}

function QueryPosts({
  userId,
  onRenderChildren,
}: {
  userId: number;
  onRenderChildren: (firstPostId: number) => React.ReactNode;
}) {
  const { data: posts, isLoading } = useUserPosts(userId);

  if (isLoading) return <Skeleton count={2} height={60} />;
  if (!posts) return null;

  const firstPost = posts[0];
  return (
    <div style={{ marginTop: "1rem" }}>
      <h3 style={{ marginBottom: "0.75rem" }}>Posts</h3>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
      {firstPost && onRenderChildren(firstPost.id)}
    </div>
  );
}

function QueryComments({ postId }: { postId: number }) {
  const { data: comments, isLoading } = usePostComments(postId);

  if (isLoading) return <Skeleton count={2} height={40} />;
  if (!comments) return null;

  return (
    <div
      style={{
        marginTop: "0.75rem",
        paddingLeft: "1rem",
        borderLeft: "2px solid var(--border)",
      }}
    >
      <h4 style={{ marginBottom: "0.5rem", color: "var(--text-muted)" }}>
        Comments
      </h4>
      {comments.map((comment) => (
        <CommentCard key={comment.id} comment={comment} />
      ))}
    </div>
  );
}

function QueryProfile({
  userId,
  onWaterfallUpdate,
}: {
  userId: number;
  onWaterfallUpdate: (bars: WaterfallBar[], total: number) => void;
}) {
  const { requestLog } = useNetwork();
  const [started] = useState(Date.now());
  const [reported, setReported] = useState(false);

  // Track waterfall from request log
  useEffect(() => {
    if (reported) return;

    const userReq = requestLog.find((r) => r.url.includes(`/users/${userId}`) && !r.url.includes("/posts"));
    const postsReq = requestLog.find((r) => r.url.includes(`/users/${userId}/posts`));
    const commentsReq = requestLog.find((r) => r.url.includes("/comments"));

    if (userReq && postsReq && commentsReq) {
      const bars: WaterfallBar[] = [
        {
          label: `GET /users/${userId}`,
          start: 0,
          duration: userReq.duration,
          color: "#6c63ff",
        },
        {
          label: `GET /users/${userId}/posts`,
          start: userReq.duration,
          duration: postsReq.duration,
          color: "#4ade80",
        },
        {
          label: "GET /posts/1/comments",
          start: userReq.duration + postsReq.duration,
          duration: commentsReq.duration,
          color: "#fbbf24",
        },
      ];
      const total = userReq.duration + postsReq.duration + commentsReq.duration;
      setReported(true);
      onWaterfallUpdate(bars, total);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestLog, userId, reported]);

  return (
    <QueryUserInfo
      userId={userId}
      onRenderChildren={() => (
        <QueryPosts
          userId={userId}
          onRenderChildren={(firstPostId) => (
            <QueryComments postId={firstPostId} />
          )}
        />
      )}
    />
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Tab 3: Parallel Fetching
// ALL requests start at mount - NO WATERFALL
// ═══════════════════════════════════════════════════════════════════════════

function ParallelProfile({
  userId,
  onWaterfallUpdate,
}: {
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

    // Fire ALL requests immediately in parallel
    Promise.all([
      trackedFetch(`${API_BASE}/users/${userId}?delay=800`).then((r) => r.json()),
      trackedFetch(`${API_BASE}/users/${userId}/posts?delay=800`).then((r) => r.json()),
      trackedFetch(`${API_BASE}/posts/1/comments?delay=800`).then((r) => r.json()),
    ]).then(([userData, postsData, commentsData]) => {
      const duration = Date.now() - totalStart;
      setUser((userData as ApiResponse<User>).data);
      setPosts((postsData as ApiResponse<Post[]>).data);
      setComments((commentsData as ApiResponse<Comment[]>).data);
      setIsLoading(false);

      // All requests ran in parallel - same start time
      const bars: WaterfallBar[] = [
        { label: `GET /users/${userId}`, start: 0, duration, color: "#6c63ff" },
        { label: `GET /users/${userId}/posts`, start: 0, duration, color: "#4ade80" },
        { label: "GET /posts/1/comments", start: 0, duration, color: "#fbbf24" },
      ];
      onWaterfallUpdate(bars, duration);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, trackedFetch]);

  if (isLoading) return <Skeleton count={5} height={60} />;
  if (!user) return null;

  const firstPost = posts[0];

  return (
    <div>
      <UserCard user={user} />
      <div style={{ marginTop: "1rem" }}>
        <h3 style={{ marginBottom: "0.75rem" }}>Posts</h3>
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
      {firstPost && comments.length > 0 && (
        <div
          style={{
            marginTop: "0.75rem",
            paddingLeft: "1rem",
            borderLeft: "2px solid var(--border)",
          }}
        >
          <h4 style={{ marginBottom: "0.5rem", color: "var(--text-muted)" }}>
            Comments
          </h4>
          {comments.map((comment) => (
            <CommentCard key={comment.id} comment={comment} />
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Main Exercise Component
// ═══════════════════════════════════════════════════════════════════════════

type Tab = "useEffect" | "useQuery" | "parallel";

export default function Exercise09() {
  const [tab, setTab] = useState<Tab>("useEffect");
  const [bars, setBars] = useState<WaterfallBar[]>([]);
  const [totalTime, setTotalTime] = useState(0);
  const [key, setKey] = useState(0);
  const { clearLog } = useNetwork();
  const queryClient = useQueryClient();

  const handleRun = () => {
    setBars([]);
    setTotalTime(0);
    clearLog();
    queryClient.clear();
    setKey((k) => k + 1);
  };

  const handleWaterfallUpdate = useCallback((b: WaterfallBar[], t: number) => {
    setBars(b);
    setTotalTime(t);
  }, []);

  return (
    <div className="exercise-container">
      <h1>
        <span className="accent">09.</span> Query Waterfall
      </h1>
      <p className="description">
        You've used React Query for caching, deduplication, and automatic retries.
        But watch what happens when your components are nested...
      </p>

      <RequestLog />

      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
        }}
      >
        <button
          className={tab === "useEffect" ? "btn-primary" : "btn-ghost"}
          onClick={() => setTab("useEffect")}
        >
          useEffect
        </button>
        <button
          className={tab === "useQuery" ? "btn-primary" : "btn-ghost"}
          onClick={() => setTab("useQuery")}
        >
          useQuery
        </button>
        <button
          className={tab === "parallel" ? "btn-primary" : "btn-ghost"}
          onClick={() => setTab("parallel")}
        >
          Parallel
        </button>
        <button className="btn-ghost" onClick={handleRun} style={{ marginLeft: "auto" }}>
          {key === 0 ? "Run" : "Reload"}
        </button>
      </div>

      {key > 0 && (
        <div style={{ display: "grid", gap: "1.5rem" }}>
          <div>
            <h3 style={{ marginBottom: "0.75rem" }}>
              {tab === "useEffect" && "useEffect + fetch"}
              {tab === "useQuery" && "useQuery (React Query)"}
              {tab === "parallel" && "Parallel fetching (lifted up)"}
            </h3>
            <WaterfallChart bars={bars} totalTime={totalTime || 1} />
          </div>

          <div className="workspace">
            {tab === "useEffect" && (
              <UseEffectProfile
                key={`effect-${key}`}
                userId={1}
                onWaterfallUpdate={handleWaterfallUpdate}
              />
            )}
            {tab === "useQuery" && (
              <QueryProfile
                key={`query-${key}`}
                userId={1}
                onWaterfallUpdate={handleWaterfallUpdate}
              />
            )}
            {tab === "parallel" && (
              <ParallelProfile
                key={`parallel-${key}`}
                userId={1}
                onWaterfallUpdate={handleWaterfallUpdate}
              />
            )}
          </div>
        </div>
      )}

      <div className="insight-box" style={{ marginTop: "2rem" }}>
        <h3>The uncomfortable truth</h3>
        <p>
          Compare the waterfall charts. <strong>useEffect</strong> and{" "}
          <strong>useQuery</strong> produce the same waterfall pattern.
          Why? Because the problem isn't the fetching library — it's the{" "}
          <strong>component structure</strong>.
        </p>
        <ul
          style={{
            marginTop: "0.75rem",
            paddingLeft: "1.5rem",
            display: "grid",
            gap: "0.5rem",
          }}
        >
          <li>
            <strong>Child can't fetch until parent renders.</strong> QueryPosts
            doesn't exist in the React tree until QueryUserInfo finishes loading.
          </li>
          <li>
            <strong>React Query solves different problems.</strong> Caching,
            deduplication, stale-while-revalidate, retry logic — all great.
            But it can't change when your components mount.
          </li>
          <li>
            <strong>The parallel version works</strong> because it lifts
            fetching to the top. But that's the same trade-off from Exercise 08:
            prop drilling, tightly-coupled components.
          </li>
        </ul>
        <p style={{ marginTop: "1rem" }}>
          <strong>Next:</strong> Exercise 10 explores Suspense, which changes{" "}
          <em>how</em> loading works. Does it fix the waterfall?
        </p>
      </div>
    </div>
  );
}
