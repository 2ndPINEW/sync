import { logInfo } from "./utils/logger";
import { onError$ } from "./services/error-handler";
import { WebSocketService } from "./services/websocket";
import { clientId } from "./utils/client";
import { capture } from "./screen-capture";

logInfo("INFO", "Initializing...");

try {
  const ws = new WebSocketService();
  ws.message$.subscribe((message) => {
    if (message.type === "request-page-open") {
      window.location.href = message.path;
    }
    if (message.type === "ping") {
      ws.send({
        type: "pong",
        clientId,
      });
    }
  });
  document.addEventListener(
    "DOMContentLoaded",
    () => {
      window.setTimeout(async () => {
        ws.send({
          type: "idle",
          id: Math.random().toString(32).slice(2),
          clientId,
          path: window.location.pathname,
          html: document.documentElement.outerHTML,
          screenshot: await capture(),
        });

        logInfo("INFO", "Send idle");
      }, 2000);
    },
    false
  );
  onError$.subscribe((error) => {
    logInfo("Detect RuntimeError", error);
  });
} catch (error) {
  logInfo("INFO", "Initialize failed", error);
} finally {
  logInfo("INFO", "Initialized");
}
