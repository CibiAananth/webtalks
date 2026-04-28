import { useNetwork } from "../context/NetworkContext";

export default function NetworkIndicator() {
  const { activeRequests } = useNetwork();
  if (activeRequests === 0) return null;

  return (
    <div className="network-indicator">
      ● {activeRequests} request{activeRequests > 1 ? "s" : ""} in flight
    </div>
  );
}
