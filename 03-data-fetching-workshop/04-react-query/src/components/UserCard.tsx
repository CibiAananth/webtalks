import type { User } from "../types";

export default function UserCard({ user }: { user: User }) {
  return (
    <div className="user-card">
      <img className="user-avatar" src={user.avatar} alt={user.name} />
      <div className="user-details">
        <h3>{user.name}</h3>
        <div className="meta">{user.email}</div>
        <span className="badge">{user.role}</span>
      </div>
    </div>
  );
}
