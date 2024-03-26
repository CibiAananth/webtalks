import { createRoot } from "react-dom/client";

import { App } from "./App";

function init() {
  const appContainer = document.querySelector("#popup-main");
  if (!appContainer) {
    throw new Error("Can not find #popup-main");
  }
  const root = createRoot(appContainer);
  root.render(<App />);
}

init();
