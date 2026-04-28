import { Routes, Route, NavLink } from "react-router-dom";
import RequestLog from "../../components/RequestLog";
import Step1 from "./steps/Step1";
import Step2 from "./steps/Step2";
import Step3 from "./steps/Step3";
import Step4Complete from "./steps/Step4Complete";

export default function Exercise05() {
  return (
    <div className="exercise-container">
      <h1><span className="accent">05.</span> useEffect + fetch</h1>
      <p className="description">
        Build a user profile component that fetches data from the API.
        Work through each step — each one adds a new piece.
        Edit the files in your editor and the browser will hot-reload.
      </p>

      <nav className="step-nav">
        <NavLink to="step-1">Step 1: Fetch & render</NavLink>
        <NavLink to="step-2">Step 2: Loading state</NavLink>
        <NavLink to="step-3">Step 3: Error handling</NavLink>
        <NavLink to="step-4">Step 4: Full pattern</NavLink>
      </nav>

      <RequestLog />

      <div style={{ marginTop: "2rem" }}>
        <Routes>
          <Route index element={<Step1 />} />
          <Route path="step-1" element={<Step1 />} />
          <Route path="step-2" element={<Step2 />} />
          <Route path="step-3" element={<Step3 />} />
          <Route path="step-4" element={<Step4Complete />} />
        </Routes>
      </div>
    </div>
  );
}
