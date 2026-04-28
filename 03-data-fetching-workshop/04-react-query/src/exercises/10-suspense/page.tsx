import { useState, Suspense, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import RequestLog from "../../components/RequestLog";
import WaterfallChart from "../../components/WaterfallChart";
import UserCard from "../../components/UserCard";
import PostCard from "../../components/PostCard";
import CommentCard from "../../components/CommentCard";
import Skeleton from "../../components/Skeleton";
import { useNetwork } from "../../context/NetworkContext";
import {
  useUser,
  useUserPosts,
  usePostComments,
  useSuspenseUser,
  useSuspenseUserPosts,
  useSuspensePostComments,
} from "../../hooks";

interface WaterfallBar {
  label: string;
  start: number;
  duration: number;
  color: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// Section 1: useQuery (no Suspense)
// Standard React Query - manual isLoading checks, sequential waterfall
// ═══════════════════════════════════════════════════════════════════════════

function UseQueryUserInfo({ userId }: { userId: number }) {
  const { data: user, isLoading } = useUser(userId);

  if (isLoading) return <Skeleton count={1} height={80} />;
  if (!user) return null;

  return <UserCard user={user} />;
}

function UseQueryPosts({ userId }: { userId: number }) {
  const { data: posts, isLoading } = useUserPosts(userId);

  if (isLoading) return <Skeleton count={2} height={60} />;
  if (!posts || posts.length === 0) return null;

  const firstPost = posts[0]!;

  return (
    <div style={{ marginTop: "1rem" }}>
      <h3 style={{ marginBottom: "0.75rem" }}>Posts</h3>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
      <UseQueryComments postId={firstPost.id} />
    </div>
  );
}

function UseQueryComments({ postId }: { postId: number }) {
  const { data: comments, isLoading } = usePostComments(postId);

  if (isLoading) return <Skeleton count={2} height={40} />;
  if (!comments || comments.length === 0) return null;

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

function UseQueryProfile({ userId }: { userId: number }) {
  return (
    <>
      <UseQueryUserInfo userId={userId} />
      <UseQueryPosts userId={userId} />
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Section 2: Naive Suspense (single boundary)
// One Suspense boundary around everything - all-or-nothing loading
// ═══════════════════════════════════════════════════════════════════════════

function SuspenseUserInfo({ userId }: { userId: number }) {
  const { data: user } = useSuspenseUser(userId);
  return <UserCard user={user} />;
}

function SuspensePosts({ userId }: { userId: number }) {
  const { data: posts } = useSuspenseUserPosts(userId);

  if (posts.length === 0) return null;
  const firstPost = posts[0]!;

  return (
    <div style={{ marginTop: "1rem" }}>
      <h3 style={{ marginBottom: "0.75rem" }}>Posts</h3>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
      <SuspenseComments postId={firstPost.id} />
    </div>
  );
}

function SuspenseComments({ postId }: { postId: number }) {
  const { data: comments } = useSuspensePostComments(postId);

  if (comments.length === 0) return null;

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

function NaiveSuspenseProfile({ userId }: { userId: number }) {
  return (
    <Suspense fallback={<Skeleton count={5} height={60} />}>
      <SuspenseUserInfo userId={userId} />
      <SuspensePosts userId={userId} />
    </Suspense>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Section 3: Sibling Suspense (parallel boundaries)
// Separate Suspense boundaries for independent sections
// ═══════════════════════════════════════════════════════════════════════════

function SiblingUserInfo({ userId }: { userId: number }) {
  const { data: user } = useSuspenseUser(userId);
  return <UserCard user={user} />;
}

function SiblingPosts({ userId }: { userId: number }) {
  const { data: posts } = useSuspenseUserPosts(userId);

  if (posts.length === 0) return null;

  return (
    <div style={{ marginTop: "1rem" }}>
      <h3 style={{ marginBottom: "0.75rem" }}>Posts</h3>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

function SiblingComments({ postId }: { postId: number }) {
  const { data: comments } = useSuspensePostComments(postId);

  if (comments.length === 0) return null;

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

function SiblingSuspenseProfile({ userId }: { userId: number }) {
  // User and Posts in parallel (sibling Suspense boundaries)
  // But Comments still depend on first post ID - sequential
  return (
    <>
      <Suspense fallback={<Skeleton count={1} height={80} />}>
        <SiblingUserInfo userId={userId} />
      </Suspense>
      <Suspense fallback={<Skeleton count={2} height={60} />}>
        <SiblingPosts userId={userId} />
        {/* Comments hardcoded to post 1 for demo - in real app this is the waterfall */}
        <Suspense fallback={<Skeleton count={2} height={40} />}>
          <SiblingComments postId={1} />
        </Suspense>
      </Suspense>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Main Exercise Component
// ═══════════════════════════════════════════════════════════════════════════

type Section = "useQuery" | "naive" | "sibling";

export default function Exercise10() {
  const [section, setSection] = useState<Section>("useQuery");
  const [bars, setBars] = useState<WaterfallBar[]>([]);
  const [totalTime, setTotalTime] = useState(0);
  const [key, setKey] = useState(0);
  const { clearLog, requestLog } = useNetwork();
  const queryClient = useQueryClient();
  const [startTime, setStartTime] = useState<number | null>(null);

  const handleRun = () => {
    setBars([]);
    setTotalTime(0);
    clearLog();
    queryClient.clear();
    setStartTime(Date.now());
    setKey((k) => k + 1);
  };

  // Build waterfall from request log
  useEffect(() => {
    if (!startTime || requestLog.length === 0) return;

    const userReq = requestLog.find(
      (r) => r.url.includes("/users/1") && !r.url.includes("/posts")
    );
    const postsReq = requestLog.find((r) => r.url.includes("/users/1/posts"));
    const commentsReq = requestLog.find((r) => r.url.includes("/comments"));

    if (userReq && postsReq && commentsReq) {
      // Calculate relative timestamps from first request
      const requests = [userReq, postsReq, commentsReq];
      const firstTimestamp = Math.min(...requests.map((r) => r.timestamp - r.duration));

      const newBars: WaterfallBar[] = [
        {
          label: "GET /users/1",
          start: userReq.timestamp - userReq.duration - firstTimestamp,
          duration: userReq.duration,
          color: "#6c63ff",
        },
        {
          label: "GET /users/1/posts",
          start: postsReq.timestamp - postsReq.duration - firstTimestamp,
          duration: postsReq.duration,
          color: "#4ade80",
        },
        {
          label: "GET /posts/1/comments",
          start: commentsReq.timestamp - commentsReq.duration - firstTimestamp,
          duration: commentsReq.duration,
          color: "#fbbf24",
        },
      ];

      const total = Math.max(...requests.map((r) => r.timestamp - firstTimestamp));
      setBars(newBars);
      setTotalTime(total);
    }
  }, [requestLog, startTime]);

  return (
    <div className="exercise-container">
      <h1>
        <span className="accent">10.</span> Suspense
      </h1>
      <p className="description">
        Suspense gives you declarative loading states and enables parallel
        fetching for sibling components. But there's a catch...
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
          className={section === "useQuery" ? "btn-primary" : "btn-ghost"}
          onClick={() => setSection("useQuery")}
        >
          useQuery
        </button>
        <button
          className={section === "naive" ? "btn-primary" : "btn-ghost"}
          onClick={() => setSection("naive")}
        >
          Naive Suspense
        </button>
        <button
          className={section === "sibling" ? "btn-primary" : "btn-ghost"}
          onClick={() => setSection("sibling")}
        >
          Sibling Suspense
        </button>
        <button
          className="btn-ghost"
          onClick={handleRun}
          style={{ marginLeft: "auto" }}
        >
          {key === 0 ? "Run" : "Reload"}
        </button>
      </div>

      {key > 0 && (
        <div style={{ display: "grid", gap: "1.5rem" }}>
          <div>
            <h3 style={{ marginBottom: "0.75rem" }}>
              {section === "useQuery" && "useQuery (manual isLoading)"}
              {section === "naive" && "Naive Suspense (single boundary)"}
              {section === "sibling" && "Sibling Suspense (parallel boundaries)"}
            </h3>
            <WaterfallChart bars={bars} totalTime={totalTime || 1} />
          </div>

          <div className="workspace">
            {section === "useQuery" && (
              <UseQueryProfile key={`query-${key}`} userId={1} />
            )}
            {section === "naive" && (
              <NaiveSuspenseProfile key={`naive-${key}`} userId={1} />
            )}
            {section === "sibling" && (
              <SiblingSuspenseProfile key={`sibling-${key}`} userId={1} />
            )}
          </div>
        </div>
      )}

      <div className="insight-box" style={{ marginTop: "2rem" }}>
        <h3>What Suspense actually does</h3>
        <div style={{ display: "grid", gap: "1rem", marginTop: "0.75rem" }}>
          <div>
            <strong>useQuery (no Suspense)</strong>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
              Each component renders, then shows its own skeleton. Sequential waterfall.
              User → Posts → Comments, one after another.
            </p>
          </div>
          <div>
            <strong>Naive Suspense (single boundary)</strong>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
              One fallback for everything. But look at the waterfall — it's still
              sequential! useSuspenseUser suspends first, then useSuspenseUserPosts,
              then useSuspensePostComments. The component tree still controls fetch order.
            </p>
          </div>
          <div>
            <strong>Sibling Suspense (parallel boundaries)</strong>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
              User and Posts are siblings, so their Suspense boundaries don't block
              each other. They fetch in parallel! But Comments still depends on
              Posts data, so it remains sequential.
            </p>
          </div>
        </div>
      </div>

      <div
        className="insight-box"
        style={{ marginTop: "1rem", borderColor: "var(--warning)" }}
      >
        <h3>The fundamental truth</h3>
        <p>
          Suspense changes <em>how you write loading states</em>, not{" "}
          <em>when fetches start</em>. The waterfall exists because:
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
            <strong>Parent-child relationships create sequential dependencies.</strong>{" "}
            A child component doesn't exist until its parent renders.
          </li>
          <li>
            <strong>Sibling Suspense helps</strong> when components are truly
            independent. User info and posts <em>could</em> load in parallel if
            structured as siblings.
          </li>
          <li>
            <strong>Data dependencies create unavoidable waterfalls.</strong>{" "}
            If comments require the first post's ID, you can't fetch them until
            posts load. That's not a library limitation — it's logic.
          </li>
        </ul>
        <p style={{ marginTop: "1rem" }}>
          <strong>The real solutions?</strong> Route loaders (Remix, React Router),
          Server Components (Next.js), or restructuring your data requirements.
          We'll cover these in the next session.
        </p>
      </div>
    </div>
  );
}
