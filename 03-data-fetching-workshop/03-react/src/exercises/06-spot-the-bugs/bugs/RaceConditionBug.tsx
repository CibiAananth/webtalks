import { useState, useEffect } from "react";
import UserCard from "../../../components/UserCard";
import Skeleton from "../../../components/Skeleton";
import FixedProfile from "./RaceConditionSolution";
import type { User } from "../../../types";

const API_BASE = "http://localhost:3069/api";

// ── THE BUGGY VERSION ────────────────────────────────────────
// This component has a race condition bug. Can you spot it?
function BuggyProfile({ userId }: { userId: number }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetch(API_BASE + "/users/" + userId + "?delay=1500")
      .then(r => r.json())
      .then(data => {
        setUser(data.data);
        setIsLoading(false);
      });
  }, [userId]);

  if (isLoading) return <Skeleton count={1} height={100} />;
  if (!user) return null;

  return <UserCard user={user} />;
}

export default function RaceConditionBug() {
  const [userId, setUserId] = useState(1);
  const [showFix, setShowFix] = useState(false);

  return (
    <div>
      <p style={{ marginBottom: "1rem", color: "var(--text-muted)" }}>
        <strong>How to trigger:</strong> Click User 1, then quickly click User 5 before
        it loads. The response for User 1 arrives after you switched — you see the wrong
        user's data flash briefly.
      </p>

      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", flexWrap: "wrap" }}>
        {[1, 2, 3, 4, 5].map(id => (
          <button
            key={id}
            className={userId === id ? "btn-primary" : "btn-ghost"}
            onClick={() => setUserId(id)}
            style={{ fontSize: "0.8rem", padding: "0.4rem 0.8rem" }}
          >
            User {id}
          </button>
        ))}
      </div>

      <div className="side-by-side">
        <div className="workspace">
          <h3 style={{ color: "var(--error)" }}>Buggy</h3>
          <BuggyProfile userId={userId} />
        </div>

        <div className="workspace solution">
          <h3 style={{ color: "var(--success)" }}>
            {showFix ? "Fixed (AbortController)" : "Click to reveal fix →"}
          </h3>
          {showFix ? (
            <FixedProfile userId={userId} />
          ) : (
            <button className="btn-ghost" onClick={() => setShowFix(true)}>
              Show Fix
            </button>
          )}
        </div>
      </div>

      {showFix && (
        <div className="insight-box" style={{ marginTop: "1rem" }}>
          <strong>The fix:</strong> Use <code>AbortController</code> in the useEffect
          cleanup function. When userId changes, the old request is aborted before the
          new one fires. The stale response never calls <code>setUser()</code>.
        </div>
      )}
    </div>
  );
}
