import { useState, useEffect } from "react";
import { useNetwork } from "../../../context/NetworkContext";
import UserCard from "../../../components/UserCard";
import type { User } from "../../../types";

const API_BASE = "http://localhost:3069/api";

export default function UserProfileSolution() {
  const [user, setUser] = useState<User | null>(null);
  const { trackedFetch } = useNetwork();

  useEffect(() => {
    async function loadUser() {
      const response = await trackedFetch(API_BASE + "/users/1?delay=800");
      const data = await response.json();
      setUser(data.data);
    }
    loadUser();
  }, [trackedFetch]);

  if (!user) return <div style={{ color: "var(--text-muted)", padding: "2rem" }}>Loading...</div>;

  return <UserCard user={user} />;
}
