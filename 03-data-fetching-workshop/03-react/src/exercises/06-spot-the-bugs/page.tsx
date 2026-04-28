import RequestLog from "../../components/RequestLog";
import BugScenario from "../../components/BugScenario";
import RaceConditionBug from "./bugs/RaceConditionBug";
import MemoryLeakBug from "./bugs/MemoryLeakBug";
import DuplicateRequestsBug from "./bugs/DuplicateRequestsBug";
import StaleCacheBug from "./bugs/StaleCacheBug";

export default function Exercise06() {
  return (
    <div className="exercise-container">
      <h1><span className="accent">06.</span> Spot the Bugs</h1>
      <p className="description">
        The useEffect + fetch pattern looks correct. Each scenario below is designed
        to trigger a hidden bug. Interact with it, see the problem, then reveal the fix.
      </p>

      <RequestLog />

      <div style={{ marginTop: "2rem", display: "grid", gap: "1rem" }}>
        <BugScenario number={1} title="The Race Condition">
          <RaceConditionBug />
        </BugScenario>

        <BugScenario number={2} title="The Memory Leak">
          <MemoryLeakBug />
        </BugScenario>

        <BugScenario number={3} title="The Duplicate Requests">
          <DuplicateRequestsBug />
        </BugScenario>

        <BugScenario number={4} title="The Stale Cache">
          <StaleCacheBug />
        </BugScenario>
      </div>

      <div className="insight-box" style={{ marginTop: "2rem" }}>
        <h3>The real problem</h3>
        <p>
          These aren't edge cases — they happen in every non-trivial React app. The
          useEffect + fetch pattern forces you to solve caching, deduplication, race
          conditions, and cleanup <strong>manually, in every component</strong>.
          This is exactly what TanStack Query (React Query) was built to handle.
          But first — Exercise 07 reveals an even bigger problem: the component waterfall.
        </p>
      </div>
    </div>
  );
}
