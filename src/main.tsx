import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";
import { registerSW } from "virtual:pwa-register";

// Register the service worker. `autoUpdate` strategy: new SW takes over on next
// reload, so we silently apply updates when a new version is ready.
const updateSW = registerSW({
  onNeedRefresh() {
    updateSW(true);
  },
  onOfflineReady() {
    // eslint-disable-next-line no-console
    console.log("[PWA] ready for offline use");
  },
});

createRoot(document.getElementById("root")!).render(<App />);
