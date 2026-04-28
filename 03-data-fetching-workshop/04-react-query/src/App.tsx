import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Exercise09 from "./exercises/09-query-waterfall/page";
import Exercise10 from "./exercises/10-suspense/page";

function App() {
  return (
    <BrowserRouter>
      <div className="workshop-banner">
        <span>Data Fetching Workshop → Session 04: React Query & Suspense</span>
        <nav className="exercise-nav">
          <NavLink to="/09">09: Query Waterfall</NavLink>
          <NavLink to="/10">10: Suspense</NavLink>
        </nav>
      </div>
      <Routes>
        <Route path="/" element={<ExerciseIndex />} />
        <Route path="/09/*" element={<Exercise09 />} />
        <Route path="/10/*" element={<Exercise10 />} />
      </Routes>
    </BrowserRouter>
  );
}

function ExerciseIndex() {
  return (
    <div className="exercise-container">
      <h1>Session 04: React Query & Suspense</h1>
      <p className="description">
        You've used React Query. Now see what it can and can't fix.
        Exercise 09 shows the structural waterfall that React Query can't solve.
        Exercise 10 explores Suspense and its surprising limitations.
      </p>
      <p className="description" style={{ marginTop: "1rem" }}>
        <strong>Key insight:</strong> React Query solves caching, deduplication, and race conditions.
        But the structural waterfall? That's a component architecture problem, not a library problem.
      </p>
    </div>
  );
}

export default App;
