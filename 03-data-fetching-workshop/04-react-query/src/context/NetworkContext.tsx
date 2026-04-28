import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { RequestLogEntry } from "../types";

interface NetworkContextValue {
  trackedFetch: (url: string, options?: RequestInit) => Promise<Response>;
  activeRequests: number;
  requestLog: RequestLogEntry[];
  clearLog: () => void;
}

const NetworkContext = createContext<NetworkContextValue | null>(null);

export function NetworkProvider({ children }: { children: ReactNode }) {
  const [activeRequests, setActiveRequests] = useState(0);
  const [requestLog, setRequestLog] = useState<RequestLogEntry[]>([]);

  const trackedFetch = useCallback(async (url: string, options?: RequestInit): Promise<Response> => {
    const startTime = Date.now();
    setActiveRequests(c => c + 1);

    try {
      const response = await fetch(url, options);
      const duration = Date.now() - startTime;
      setRequestLog(log => [...log, {
        url: url.replace("http://localhost:3069", ""),
        status: response.status,
        duration,
        timestamp: Date.now(),
      }]);
      return response;
    } finally {
      setActiveRequests(c => c - 1);
    }
  }, []);

  const clearLog = useCallback(() => setRequestLog([]), []);

  return (
    <NetworkContext.Provider value={{ trackedFetch, activeRequests, requestLog, clearLog }}>
      {children}
    </NetworkContext.Provider>
  );
}

export function useNetwork(): NetworkContextValue {
  const ctx = useContext(NetworkContext);
  if (!ctx) throw new Error("useNetwork must be used within NetworkProvider");
  return ctx;
}
