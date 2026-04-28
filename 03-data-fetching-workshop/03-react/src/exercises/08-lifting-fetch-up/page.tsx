import { useState, useCallback } from "react";
import RequestLog from "../../components/RequestLog";
import WaterfallChart from "../../components/WaterfallChart";
import UserCard from "../../components/UserCard";
import PostCard from "../../components/PostCard";
import CommentCard from "../../components/CommentCard";
import ProfilePageSolution from "./ProfilePageSolution";
import type { User, Post, Comment } from "../../types";

const API_BASE = "http://localhost:3069/api";

interface WaterfallBar {
  label: string;
  start: number;
  duration: number;
  color: string;
}

// ── DISPLAY-ONLY COMPONENTS (no fetching) ─────────────────────
// Use these in your solution — they just render data passed as props

export function UserInfoDisplay({ user }: { user: User }) {
  return <UserCard user={user} />;
}

export function UserPostsDisplay({ posts }: { posts: Post[] }) {
  return (
    <div style={{ marginTop: "1rem" }}>
      <h3 style={{ marginBottom: "0.75rem" }}>Posts</h3>
      {posts.map(post => <PostCard key={post.id} post={post} />)}
    </div>
  );
}

export function PostCommentsDisplay({ comments }: { comments: Comment[] }) {
  return (
    <div style={{ marginTop: "0.75rem", paddingLeft: "1rem", borderLeft: "2px solid var(--border)" }}>
      <h4 style={{ marginBottom: "0.5rem", color: "var(--text-muted)" }}>Comments</h4>
      {comments.map(comment => <CommentCard key={comment.id} comment={comment} />)}
    </div>
  );
}


// ════════════════════════════════════════════════════════════
// 🏋️ YOUR CODE: Fetch everything at the page level
// ════════════════════════════════════════════════════════════
//
// Instead of each component fetching its own data, fetch ALL
// data here and pass it down as props.
//
// Your task:
// 1. Use Promise.all to fetch user AND posts in parallel
// 2. After posts load, fetch comments for the first post
// 3. Store user, posts, and comments in state
// 4. Pass data to the display components above
// 5. Call onWaterfallUpdate(bars, totalTime) to update the chart
//
// API endpoints:
// - GET /api/users/{userId}?delay=800
// - GET /api/users/{userId}/posts?delay=800
// - GET /api/posts/{postId}/comments?delay=800
//
// For the waterfall chart, track timing like this:
// const totalStart = Date.now();
// const bars: WaterfallBar[] = [];
// // After fetching, push bars with: { label, start, duration, color }

function ProfilePageProblem({ userId, onWaterfallUpdate }: {
  userId: number;
  onWaterfallUpdate: (bars: WaterfallBar[], total: number) => void;
}) {
  // TODO: Add state for user, posts, comments, isLoading
  // TODO: Add useEffect with fetching logic
  // TODO: Render display components with fetched data

  return (
    <div style={{ color: "var(--text-muted)", padding: "2rem", textAlign: "center" }}>
      TODO: Implement page-level fetching. Open this file in your editor.
    </div>
  );
}


export default function Exercise08() {
  const [problemBars, setProblemBars] = useState<WaterfallBar[]>([]);
  const [problemTime, setProblemTime] = useState(0);
  const [solutionBars, setSolutionBars] = useState<WaterfallBar[]>([]);
  const [solutionTime, setSolutionTime] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [key, setKey] = useState(0);

  const handleProblemWaterfallUpdate = useCallback((bars: WaterfallBar[], total: number) => {
    setProblemBars(bars);
    setProblemTime(total);
  }, []);

  const handleSolutionWaterfallUpdate = useCallback((bars: WaterfallBar[], total: number) => {
    setSolutionBars(bars);
    setSolutionTime(total);
  }, []);

  return (
    <div className="exercise-container">
      <h1><span className="accent">08.</span> Lifting Fetch Up</h1>
      <p className="description">
        Move all fetching to the page level. Fetch user and posts in parallel,
        then comments after. Compare the waterfall with Exercise 07.
      </p>

      <RequestLog />

      <div style={{ margin: "1.5rem 0", display: "flex", gap: "1rem" }}>
        <button className="btn-primary" onClick={() => setKey(k => k + 1)}>
          {key === 0 ? "Load Both" : "Reload"}
        </button>
        <button className="btn-ghost" onClick={() => setShowSolution(s => !s)}>
          {showSolution ? "Hide Solution" : "Show Solution"}
        </button>
      </div>

      {key > 0 && (
        <div className="side-by-side">
          <div>
            <h3 style={{ marginBottom: "0.75rem" }}>Your Version</h3>
            <WaterfallChart bars={problemBars} totalTime={problemTime || 1} />
            <div className="workspace" style={{ marginTop: "1rem" }}>
              <ProfilePageProblem
                key={"problem-" + key}
                userId={1}
                onWaterfallUpdate={handleProblemWaterfallUpdate}
              />
            </div>
          </div>

          <div>
            <h3 style={{ marginBottom: "0.75rem" }}>
              {showSolution ? "Solution" : "Solution (hidden)"}
            </h3>
            {showSolution ? (
              <>
                <WaterfallChart bars={solutionBars} totalTime={solutionTime || 1} />
                <div className="workspace solution" style={{ marginTop: "1rem" }}>
                  <ProfilePageSolution
                    key={"solution-" + key}
                    userId={1}
                    onWaterfallUpdate={handleSolutionWaterfallUpdate}
                  />
                </div>
              </>
            ) : (
              <div className="workspace" style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)" }}>
                Implement yours first, then reveal
              </div>
            )}
          </div>
        </div>
      )}

      <div className="insight-box" style={{ marginTop: "2rem" }}>
        <h3>It works, but at what cost?</h3>
        <p>You eliminated the waterfall. But look at what happened:</p>
        <ul style={{ marginTop: "0.75rem", paddingLeft: "1.5rem", display: "grid", gap: "0.5rem" }}>
          <li><strong>Components lost independence.</strong> UserInfoDisplay can't fetch its own data. Drop it on another page and someone else has to provide the data.</li>
          <li><strong>The page knows too much.</strong> This page component manages users, posts, AND comments. Add more sections, add more state variables and fetches.</li>
          <li><strong>Loading is all-or-nothing.</strong> Everything shows a skeleton until everything is ready. You can't show the user's name while posts are still loading without making this much more complex.</li>
          <li><strong>Prop drilling.</strong> In a real app with 20 components, you'd be threading data through 5 levels of props.</li>
        </ul>
        <p style={{ marginTop: "1rem" }}>
          This is the fundamental tension: <strong>component-level fetching</strong> gives you
          clean, independent components but waterfalls. <strong>Page-level fetching</strong> gives
          you performance but messy, tightly-coupled code.
        </p>
        <p style={{ marginTop: "0.75rem" }}>
          <strong>React Query</strong> resolves this by giving you component-level fetching with
          automatic deduplication and caching — no waterfall, no prop drilling.
          <strong> Route loaders</strong> resolve it by tying fetching to the URL, not the component tree.
          Both are coming in the next sessions.
        </p>
      </div>
    </div>
  );
}
