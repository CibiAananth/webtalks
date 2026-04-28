import { useState, useEffect } from "react";
import UserCard from "../../../components/UserCard";
import Skeleton from "../../../components/Skeleton";
import ErrorMessage from "../../../components/ErrorMessage";
import UserProfileSolution from "./Step3Solution";
import type { User } from "../../../types";

const API_BASE = "http://localhost:3069/api";

// ════════════════════════════════════════════════════════════
// 🏋️ YOUR CODE: Add error handling
// ════════════════════════════════════════════════════════════
//
// What if the API returns a 404? Or the server is down?
// Your task:
// 1. Add an error state
// 2. Wrap the fetch in try/catch
// 3. Check response.ok (fetch doesn't throw on 404!)
// 4. Show <ErrorMessage message={error} onRetry={...} /> on error
//
// Test it: use the buttons below to switch between user IDs.
// Users 1-5 work. User 999 returns 404.
//
// Important: fetch() does NOT throw on HTTP errors like 404.
// You must check response.ok yourself!

function UserProfileProblem({ userId }: { userId: number }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // TODO: Add error state here

  useEffect(() => {
    async function loadUser() {
      setIsLoading(true);
      // TODO: Add try/catch and check response.ok
      const response = await fetch(API_BASE + "/users/" + userId + "?delay=800");
      const data = await response.json();
      setUser(data.data);
      setIsLoading(false);
    }
    loadUser();
  }, [userId]);

  if (isLoading) return <Skeleton count={1} height={100} />;
  // TODO: Return <ErrorMessage /> if there's an error
  if (!user) return null;

  return <UserCard user={user} />;
}


export default function Step3() {
  const [userId, setUserId] = useState(1);
  const [showSolution, setShowSolution] = useState(false);

  return (
    <div>
      <div className="instruction-card">
        <h2>Step 3: Add error handling</h2>
        <p>
          Open <code>src/exercises/05-useeffect-fetch/steps/Step3.tsx</code>.
          Add error handling with try/catch and a retry button.
        </p>
        <p className="hint">
          Remember: <code>fetch()</code> does NOT throw on HTTP errors like 404.
          You must check <code>response.ok</code> yourself and throw manually.
        </p>
      </div>

      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", flexWrap: "wrap" }}>
        <span style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)", fontSize: "0.85rem", alignSelf: "center" }}>
          User ID:
        </span>
        {[1, 2, 3, 4, 5, 999].map(id => (
          <button
            key={id}
            className={userId === id ? "btn-primary" : "btn-ghost"}
            onClick={() => setUserId(id)}
            style={{ fontSize: "0.8rem", padding: "0.4rem 0.8rem" }}
          >
            {id === 999 ? "999 (404)" : id}
          </button>
        ))}
      </div>

      <div className="workspace">
        <h3>Your Component — User {userId}</h3>
        <UserProfileProblem userId={userId} />
      </div>

      <div className="solution-toggle">
        <button className="btn-ghost" onClick={() => setShowSolution(s => !s)}>
          {showSolution ? "Hide Solution" : "Show Solution"}
        </button>
      </div>

      {showSolution && (
        <div className="workspace solution">
          <h3>Solution — User {userId}</h3>
          <UserProfileSolution userId={userId} />
        </div>
      )}
    </div>
  );
}
