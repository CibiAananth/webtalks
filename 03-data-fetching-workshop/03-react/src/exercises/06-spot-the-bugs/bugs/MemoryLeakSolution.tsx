import { useState, useEffect } from "react";
import { useNetwork } from "../../../context/NetworkContext";
import UserCard from "../../../components/UserCard";
import Skeleton from "../../../components/Skeleton";
import type { User } from "../../../types";

const API_BASE = "http://localhost:3069/api";

export default function FixedProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { trackedFetch } = useNetwork();

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);

    trackedFetch(API_BASE + "/users/1?delay=3000", { signal: controller.signal })
      .then(r => r.json())
      .then(data => {
        setUser(data.data);
        setIsLoading(false);
      })
      .catch(err => {
        if (err.name !== "AbortError") console.error(err);
      });

    return () => controller.abort();
  }, [trackedFetch]);

  if (isLoading) return <Skeleton count={1} height={100} />;
  if (!user) return null;

  return <UserCard user={user} />;
}
