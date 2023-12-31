import { logInfo } from "./utils/logger";
import { onError$ } from "./services/error-handler";
import { WebSocketService } from "./services/websocket";
import { clientId } from "./utils/client";
import { capture } from "./screen-capture";
import { take, timer } from "rxjs";

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
    async () => {
      timer(3000).subscribe(async () => {
        timer(0, 10)
          .pipe(take(100))
          .subscribe((i) => {
            window.scrollTo({
              top: i * 100,
              left: 0,
            });
          });
        timer(3000).subscribe(async () => {
          ws.send({
            type: "idle",
            id: Math.random().toString(32).slice(2),
            clientId,
            path: window.location.pathname,
            html: document.documentElement.outerHTML,
            screenshot: await capture(),
          });
          logInfo("INFO", "Send loaded");
        });
      });
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
