import { useState, useEffect } from "react";
import { useNetwork } from "../../../context/NetworkContext";
import UserCard from "../../../components/UserCard";
import Skeleton from "../../../components/Skeleton";
import type { User } from "../../../types";

const API_BASE = "http://localhost:3069/api";

function UserDetail({ userId, onBack }: { userId: number; onBack: () => void }) {
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

  return (
    <div>
      <button className="btn-ghost" onClick={onBack} style={{ marginBottom: "1rem", fontSize: "0.85rem" }}>
        ← Back to list
      </button>
      {isLoading ? <Skeleton count={1} height={100} /> : user && <UserCard user={user} />}
    </div>
  );
}

function UserList({ onSelect }: { onSelect: (id: number) => void }) {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetch(API_BASE + "/users?delay=800")
      .then(r => r.json())
      .then(data => {
        setUsers(data.data);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) return <Skeleton count={5} height={50} />;

  return (
    <div style={{ display: "grid", gap: "0.5rem" }}>
      {users.map(user => (
        <button
          key={user.id}
          className="card"
          onClick={() => onSelect(user.id)}
          style={{
            cursor: "pointer",
            textAlign: "left",
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          <img src={user.avatar} alt="" style={{ width: 32, height: 32, borderRadius: "50%" }} />
          <span>{user.name}</span>
          <span className="badge" style={{ marginLeft: "auto" }}>{user.role}</span>
        </button>
      ))}
    </div>
  );
}

export default function StaleCacheBug() {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const { requestLog } = useNetwork();
  const totalRequests = requestLog.length;

  return (
    <div>
      <p style={{ marginBottom: "1rem", color: "var(--text-muted)" }}>
        <strong>How to trigger:</strong> Click a user to see their profile. Go back.
        Click the same user again. Watch the request log — it fetches again even though
        you just saw this data 2 seconds ago. Navigate back and forth a few times.
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
        Total requests so far: <strong style={{ fontSize: "1.5rem" }}>{totalRequests}</strong>
        <span style={{ color: "var(--text-muted)", marginLeft: "0.5rem" }}>
          (keeps growing)
        </span>
      </div>

      <div className="workspace">
        {selectedUserId === null ? (
          <UserList onSelect={setSelectedUserId} />
        ) : (
          <UserDetail userId={selectedUserId} onBack={() => setSelectedUserId(null)} />
        )}
      </div>

      <div className="insight-box" style={{ marginTop: "1rem" }}>
        <strong>No cache, no memory.</strong> Every mount is a fresh start. The component
        forgets everything when it unmounts. Navigate to User 1 ten times, make ten
        requests. On mobile with slow networks, this means a loading spinner every time
        you go back. React Query's <code>staleTime</code> and cache solve this — show
        cached data instantly while refetching in the background.
      </div>
    </div>
  );
}
