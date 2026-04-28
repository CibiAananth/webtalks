import { useState, useEffect } from "react";
import UserCard from "../../../components/UserCard";
import Skeleton from "../../../components/Skeleton";
import UserProfileSolution from "./Step2Solution";
import type { User } from "../../../types";

const API_BASE = "http://localhost:3069/api";

// ════════════════════════════════════════════════════════════
// 🏋️ YOUR CODE: Add a loading state
// ════════════════════════════════════════════════════════════
//
// Step 1's component shows "No data yet..." while loading — bad UX.
// Your task:
// 1. Add an isLoading state (starts as true)
// 2. Set it to false when fetch completes
// 3. Show <Skeleton count={1} height={100} /> while loading
//
// The fetch is already implemented below. You just need to add
// loading state management around it.

function UserProfileProblem() {
  const [user, setUser] = useState<User | null>(null);
  // TODO: Add loading state here

  useEffect(() => {
    async function loadUser() {
      const response = await fetch(API_BASE + "/users/1?delay=800");
      const data = await response.json();
      setUser(data.data);
    }
    loadUser();
  }, []);

  // TODO: Return <Skeleton /> while loading

  if (!user) {
    return (
      <div style={{ color: "var(--text-muted)", padding: "2rem" }}>
        No data yet...
      </div>
    );
  }

  return <UserCard user={user} />;
}


export default function Step2() {
  const [showSolution, setShowSolution] = useState(false);

  return (
    <div>
      <div className="instruction-card">
        <h2>Step 2: Add a loading state</h2>
        <p>
          Open <code>src/exercises/05-useeffect-fetch/steps/Step2.tsx</code>.
          Add an <code>isLoading</code> state so the component shows a skeleton placeholder while fetching.
        </p>
        <p className="hint">
          Initialize <code>isLoading</code> as <code>true</code>, set to <code>false</code> after
          the fetch completes. Render <code>{"<Skeleton />"}</code> while loading.
        </p>
      </div>

      <div className="workspace">
        <h3>Your Component</h3>
        <UserProfileProblem />
      </div>

      <div className="solution-toggle">
        <button className="btn-ghost" onClick={() => setShowSolution(s => !s)}>
          {showSolution ? "Hide Solution" : "Show Solution"}
        </button>
      </div>

      {showSolution && (
        <div className="workspace solution">
          <h3>Solution</h3>
          <UserProfileSolution />
        </div>
      )}
    </div>
  );
}
