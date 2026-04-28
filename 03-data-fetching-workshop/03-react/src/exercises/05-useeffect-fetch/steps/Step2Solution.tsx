import { useState, useEffect } from "react";
import { useNetwork } from "../../../context/NetworkContext";
import UserCard from "../../../components/UserCard";
import Skeleton from "../../../components/Skeleton";
import type { User } from "../../../types";

const API_BASE = "http://localhost:3069/api";

export default function UserProfileSolution() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { trackedFetch } = useNetwork();

  useEffect(() => {
    async function loadUser() {
      setIsLoading(true);
      const response = await trackedFetch(API_BASE + "/users/1?delay=800");
      const data = await response.json();
      setUser(data.data);
      setIsLoading(false);
    }
    loadUser();
  }, [trackedFetch]);

  if (isLoading) return <Skeleton count={1} height={100} />;
  if (!user) return null;

  return <UserCard user={user} />;
}
