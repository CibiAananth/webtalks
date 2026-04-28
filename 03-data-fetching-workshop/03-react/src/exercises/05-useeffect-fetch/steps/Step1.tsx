import { useState } from "react";
import UserCard from "../../../components/UserCard";
import UserProfileSolution from "./Step1Solution";
import type { User } from "../../../types";

const API_BASE = "http://localhost:3069/api";

// ════════════════════════════════════════════════════════════
// 🏋️ YOUR CODE: Complete this component
// ════════════════════════════════════════════════════════════
//
// Make this component:
// 1. Store user data in state
// 2. Fetch from the API when the component mounts
// 3. Render the user with <UserCard />
//
// API endpoint: GET http://localhost:3069/api/users/1?delay=800
// Response format: { data: User }
//
// Hints:
// - You need useState for the data
// - You need useEffect to trigger the fetch on mount
// - You can't make useEffect's callback async directly
//   (define an async function inside and call it)

function UserProfileProblem() {
  const user: User | null = null;

  if (!user) {
    return (
      <div style={{ color: "var(--text-muted)", padding: "2rem" }}>
        No data yet. Complete the TODO above.
      </div>
    );
  }

  return <UserCard user={user} />;
}


export default function Step1() {
  const [showSolution, setShowSolution] = useState(false);

  return (
    <div>
      <div className="instruction-card">
        <h2>Step 1: Fetch data and render it</h2>
        <p>
          Open <code>src/exercises/05-useeffect-fetch/steps/Step1.tsx</code> in your editor.
          Complete the <code>UserProfileProblem</code> component to fetch and display a user.
        </p>
        <p className="hint">
          You need <code>useState</code> for the data and <code>useEffect</code> to trigger
          the fetch on mount. The API returns <code>{"{ data: User }"}</code>.
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
