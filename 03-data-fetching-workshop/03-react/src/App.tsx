import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Exercise05 from "./exercises/05-useeffect-fetch/page";
import Exercise06 from "./exercises/06-spot-the-bugs/page";
import Exercise07 from "./exercises/07-component-waterfall/page";
import Exercise08 from "./exercises/08-lifting-fetch-up/page";

function App() {
  return (
    <BrowserRouter>
      <div className="workshop-banner">
        <span>Data Fetching Workshop → Session 03: React & useEffect</span>
        <nav className="exercise-nav">
          <NavLink to="/05">05: useEffect</NavLink>
          <NavLink to="/06">06: Bugs</NavLink>
          <NavLink to="/07">07: Waterfall</NavLink>
          <NavLink to="/08">08: Lifting Up</NavLink>
        </nav>
      </div>
      <Routes>
        <Route path="/" element={<ExerciseIndex />} />
        <Route path="/05/*" element={<Exercise05 />} />
        <Route path="/06/*" element={<Exercise06 />} />
        <Route path="/07/*" element={<Exercise07 />} />
        <Route path="/08/*" element={<Exercise08 />} />
      </Routes>
    </BrowserRouter>
  );
}

function ExerciseIndex() {
  return (
    <div className="exercise-container">
      <h1>Session 03: React & useEffect</h1>
      <p className="description">
        In this session, you'll build the useEffect + fetch pattern, discover its bugs,
        see the component waterfall problem, and understand why the community moved beyond it.
        Pick an exercise from the nav above to start.
      </p>
    </div>
  );
}

export default App;
