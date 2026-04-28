import { useState, type ReactNode } from "react";

interface BugScenarioProps {
  number: number;
  title: string;
  children: ReactNode;
}

export default function BugScenario({ number, title, children }: BugScenarioProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bug-scenario" data-open={isOpen}>
      <button
        className="bug-scenario-header"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="accent">Bug #{number}</span>
        <span>{title}</span>
        <span style={{ marginLeft: "auto" }}>{isOpen ? "▾" : "▸"}</span>
      </button>
      {isOpen && <div className="bug-scenario-body">{children}</div>}
    </div>
  );
}
