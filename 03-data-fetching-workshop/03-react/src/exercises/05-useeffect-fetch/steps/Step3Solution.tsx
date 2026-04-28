import { useState, useEffect } from "react";
import { useNetwork } from "../../../context/NetworkContext";
import UserCard from "../../../components/UserCard";
import Skeleton from "../../../components/Skeleton";
import ErrorMessage from "../../../components/ErrorMessage";
import type { User } from "../../../types";

const API_BASE = "http://localhost:3069/api";

export default function UserProfileSolution({ userId }: { userId: number }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { trackedFetch } = useNetwork();

  function loadUser() {
    setIsLoading(true);
    setError(null);
    setUser(null);

    trackedFetch(API_BASE + "/users/" + userId + "?delay=800")
      .then(response => {
        if (!response.ok) throw new Error("User not found (status " + response.status + ")");
        return response.json();
      })
      .then(data => {
        setUser(data.data);
      })
      .catch(err => {
        setError(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  useEffect(() => {
    loadUser();
  }, [userId]);

  if (isLoading) return <Skeleton count={1} height={100} />;
  if (error) return <ErrorMessage message={error} onRetry={loadUser} />;
  if (!user) return null;

  return <UserCard user={user} />;
}
