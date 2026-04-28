import { useState, useEffect } from "react";
import { useNetwork } from "../../../context/NetworkContext";
import UserCard from "../../../components/UserCard";
import Skeleton from "../../../components/Skeleton";
import type { User } from "../../../types";

const API_BASE = "http://localhost:3069/api";

// Each instance of this component fetches independently
function UserGreeting({ userId }: { userId: number }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetch(API_BASE + "/users/" + userId + "?delay=800")
      .then(r => r.json())
      .then(data => {
        setUser(data.data);
        setIsLoading(false);
      });
  }, [userId]);

  if (isLoading) return <Skeleton count={1} height={40} />;
  if (!user) return null;

  return <div style={{ padding: "0.5rem", color: "var(--text)" }}>Hello, {user.name}!</div>;
}

function UserSidebar({ userId }: { userId: number }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetch(API_BASE + "/users/" + userId + "?delay=800")
      .then(r => r.json())
      .then(data => {
        setUser(data.data);
        setIsLoading(false);
      });
  }, [userId]);

  if (isLoading) return <Skeleton count={1} height={80} />;
  if (!user) return null;

  return <UserCard user={user} />;
}

function UserBadge({ userId }: { userId: number }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetch(API_BASE + "/users/" + userId + "?delay=800")
      .then(r => r.json())
      .then(data => {
        setUser(data.data);
        setIsLoading(false);
      });
  }, [userId]);

  if (isLoading) return <Skeleton count={1} height={30} />;
  if (!user) return null;

  return <span className="badge">{user.name} — {user.role}</span>;
}

export default function DuplicateRequestsBug() {
  const { requestLog } = useNetwork();
  const userRequests = requestLog.filter(r => r.url.includes("/users/1"));

  return (
    <div>
      <p style={{ marginBottom: "1rem", color: "var(--text-muted)" }}>
        <strong>The scenario:</strong> Three components on the same page all need User 1's
        data. Each one fetches independently. Look at the request log after they load.
      </p>

      <div style={{
        background: "var(--accent-dim)",
        border: "1px solid var(--accent)",
        borderRadius: 8,
        padding: "1rem",
        marginBottom: "1rem",
        fontFamily: "var(--font-mono)",
        fontSize: "0.9rem",
        textAlign: "center",
      }}>
        Requests to /api/users/1: <strong style={{ fontSize: "1.5rem" }}>{userRequests.length}</strong>
        <span style={{ color: "var(--text-muted)", marginLeft: "0.5rem" }}>
          (should be 1)
        </span>
      </div>

      <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "1fr 1fr 1fr" }}>
        <div className="card">
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
            {"<UserGreeting />"}
          </div>
          <UserGreeting userId={1} />
        </div>
        <div className="card">
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
            {"<UserSidebar />"}
          </div>
          <UserSidebar userId={1} />
        </div>
        <div className="card">
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
            {"<UserBadge />"}
          </div>
          <UserBadge userId={1} />
        </div>
      </div>

      <div className="insight-box" style={{ marginTop: "1rem" }}>
        <strong>No fix exists within useEffect.</strong> Each component is independent —
        it doesn't know other components exist. You'd need to lift the fetch to a parent
        and prop-drill (messy), use a global store like Redux (heavy), or use a server-state
        cache like <strong>React Query</strong> that automatically deduplicates identical
        requests. That's Session 04.
      </div>
    </div>
  );
}
