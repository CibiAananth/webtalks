import { useNetwork } from "../context/NetworkContext";

export default function RequestLog() {
  const { requestLog, clearLog } = useNetwork();

  return (
    <div className="request-log">
      <div className="request-log-header">
        <span>● Network Log ({requestLog.length} requests)</span>
        <button className="btn-ghost" onClick={clearLog} style={{ fontSize: "0.7rem" }}>Clear</button>
      </div>
      <div className="request-log-body">
        {requestLog.length === 0 ? (
          <div style={{ color: "var(--text-muted)", fontStyle: "italic" }}>Waiting for requests...</div>
        ) : (
          requestLog.map((entry, i) => (
            <div key={i} className="log-entry">
              <span className="method">GET</span>
              <span className="url">{entry.url}</span>
              <span className={`status ${entry.status < 300 ? "ok" : "err"}`}>{entry.status}</span>
              <span className="time">{entry.duration}ms</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
