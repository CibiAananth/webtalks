import { useState, useEffect } from "react";
import UserCard from "../../../components/UserCard";
import Skeleton from "../../../components/Skeleton";
import FixedProfile from "./MemoryLeakSolution";
import type { User } from "../../../types";

const API_BASE = "http://localhost:3069/api";

// ── THE BUGGY VERSION ────────────────────────────────────────
// This component has a memory leak bug. Can you spot it?
function BuggyProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetch(API_BASE + "/users/1?delay=3000")
      .then(r => r.json())
      .then(data => {
        setUser(data.data);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) return <Skeleton count={1} height={100} />;
  if (!user) return null;

  return <UserCard user={user} />;
}

export default function MemoryLeakBug() {
  const [showBuggy, setShowBuggy] = useState(false);
  const [showFixed, setShowFixed] = useState(false);
  const [showFix, setShowFix] = useState(false);

  return (
    <div>
      <p style={{ marginBottom: "1rem", color: "var(--text-muted)" }}>
        <strong>How to trigger:</strong> Click "Mount" to show the component. While
        it's loading (3 second delay), click "Unmount". The fetch is still in flight
        and will try to call setState on an unmounted component.
        Check the network log — the request completes even though nobody's listening.
      </p>

      <div className="side-by-side">
        <div className="workspace">
          <h3 style={{ color: "var(--error)" }}>Buggy</h3>
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
            <button className="btn-primary" onClick={() => setShowBuggy(true)} style={{ fontSize: "0.8rem" }}>
              Mount
            </button>
            <button className="btn-ghost" onClick={() => setShowBuggy(false)} style={{ fontSize: "0.8rem" }}>
              Unmount
            </button>
          </div>
          {showBuggy && <BuggyProfile />}
          {!showBuggy && <div style={{ color: "var(--text-muted)", padding: "1rem" }}>Component unmounted</div>}
        </div>

        <div className="workspace solution">
          <h3 style={{ color: "var(--success)" }}>
            {showFix ? "Fixed" : "Click to reveal fix →"}
          </h3>
          {showFix ? (
            <>
              <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
                <button className="btn-primary" onClick={() => setShowFixed(true)} style={{ fontSize: "0.8rem" }}>
                  Mount
                </button>
                <button className="btn-ghost" onClick={() => setShowFixed(false)} style={{ fontSize: "0.8rem" }}>
                  Unmount
                </button>
              </div>
              {showFixed && <FixedProfile />}
              {!showFixed && <div style={{ color: "var(--text-muted)", padding: "1rem" }}>Component unmounted</div>}
            </>
          ) : (
            <button className="btn-ghost" onClick={() => setShowFix(true)}>Show Fix</button>
          )}
        </div>
      </div>

      {showFix && (
        <div className="insight-box" style={{ marginTop: "1rem" }}>
          <strong>The fix:</strong> Return a cleanup function from useEffect that aborts the
          request. When the component unmounts, React calls the cleanup, the request is
          cancelled, and no setState is attempted.
        </div>
      )}
    </div>
  );
}
