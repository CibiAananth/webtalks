import { useState, useEffect } from "react";
import { useNetwork } from "../../../context/NetworkContext";
import UserCard from "../../../components/UserCard";
import Skeleton from "../../../components/Skeleton";
import type { User } from "../../../types";

const API_BASE = "http://localhost:3069/api";

export default function FixedProfile({ userId }: { userId: number }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { trackedFetch } = useNetwork();

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);

    trackedFetch(API_BASE + "/users/" + userId + "?delay=1500", {
      signal: controller.signal,
    })
      .then(r => r.json())
      .then(data => {
        setUser(data.data);
        setIsLoading(false);
      })
      .catch(err => {
        if (err.name !== "AbortError") {
          console.error(err);
        }
      });

    // Cleanup: abort the in-flight request when userId changes or component unmounts
    return () => controller.abort();
  }, [userId, trackedFetch]);

  if (isLoading) return <Skeleton count={1} height={100} />;
  if (!user) return null;

  return <UserCard user={user} />;
}
