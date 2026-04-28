import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { NetworkProvider } from "./context/NetworkContext";
import NetworkIndicator from "./components/NetworkIndicator";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
    <NetworkProvider>
      <App />
      <NetworkIndicator />
    </NetworkProvider>
  // </StrictMode>
);
