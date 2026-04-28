import { useState, useEffect, useCallback } from "react";
import { useNetwork } from "../../../context/NetworkContext";
import UserCard from "../../../components/UserCard";
import Skeleton from "../../../components/Skeleton";
import ErrorMessage from "../../../components/ErrorMessage";
import type { User } from "../../../types";

const API_BASE = "http://localhost:3069/api";

// ════════════════════════════════════════════════════════════
// ✅ THE COMPLETE useEffect + fetch PATTERN
// ════════════════════════════════════════════════════════════
// This is what "correct" useEffect + fetch looks like.
// Loading state, error handling, cleanup, re-fetch on prop change.
// Count the lines. Then ask: is this really the best we can do?

function UserProfile({ userId }: { userId: number }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { trackedFetch } = useNetwork();

  const loadUser = useCallback(() => {
    let cancelled = false;

    setIsLoading(true);
    setError(null);

    async function doFetch() {
      try {
        const response = await trackedFetch(
          API_BASE + "/users/" + userId + "?delay=800"
        );
        if (!response.ok) {
          throw new Error("Failed to load user (status " + response.status + ")");
        }
        const data = await response.json();

        if (!cancelled) {
          setUser(data.data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Unknown error");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    doFetch();

    return () => {
      cancelled = true;
    };
  }, [userId, trackedFetch]);

  useEffect(() => {
    const cleanup = loadUser();
    return cleanup;
  }, [loadUser]);

  if (isLoading) return <Skeleton count={1} height={100} />;
  if (error) return <ErrorMessage message={error} onRetry={loadUser} />;
  if (!user) return null;

  return <UserCard user={user} />;
}


export default function Step4Complete() {
  const [userId, setUserId] = useState(1);

  return (
    <div>
      <div className="instruction-card">
        <h2>Step 4: The Complete Pattern</h2>
        <p>
          This is the "correct" <code>useEffect + fetch</code> pattern with loading,
          errors, cleanup, and re-fetch on prop change. Play with it below.
        </p>
      </div>

      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", flexWrap: "wrap" }}>
        <span style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)", fontSize: "0.85rem", alignSelf: "center" }}>
          Select user:
        </span>
        {[1, 2, 3, 4, 5, 999].map(id => (
          <button
            key={id}
            className={userId === id ? "btn-primary" : "btn-ghost"}
            onClick={() => setUserId(id)}
            style={{ fontSize: "0.8rem", padding: "0.4rem 0.8rem" }}
          >
            {id === 999 ? "999 (404)" : `User ${id}`}
          </button>
        ))}
      </div>

      <div className="workspace">
        <UserProfile userId={userId} />
      </div>

      <div className="insight-box" style={{ marginTop: "2rem" }}>
        <h3>Looks correct. But is it?</h3>
        <p>
          This component handles loading, errors, cleanup, and re-fetching. It's about
          40 lines of code for a <strong>single fetch</strong>. And it still has problems
          you can't see in this isolated demo:
        </p>
        <ul style={{ marginTop: "0.75rem", paddingLeft: "1.5rem", display: "grid", gap: "0.5rem" }}>
          <li>What happens if you click between users <strong>really fast</strong>? (race condition)</li>
          <li>What if you <strong>unmount</strong> the component mid-fetch? (wasted request)</li>
          <li>What if <strong>three components</strong> on the same page need this user's data? (duplicate requests)</li>
          <li>What if you <strong>navigate away and come back</strong>? (refetches every time, no cache)</li>
        </ul>
        <p style={{ marginTop: "1rem" }}>
          Head to <strong>Exercise 06</strong> to see each of these bugs in action.
        </p>
      </div>
    </div>
  );
}
