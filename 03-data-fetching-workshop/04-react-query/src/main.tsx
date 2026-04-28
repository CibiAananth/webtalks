import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import { NetworkProvider } from "./context/NetworkContext";
import NetworkIndicator from "./components/NetworkIndicator";
import "./styles.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Disable automatic refetching for workshop clarity
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: false,
      staleTime: Infinity,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <NetworkProvider>
        <App />
        <NetworkIndicator />
      </NetworkProvider>
    </QueryClientProvider>
  </StrictMode>
);
