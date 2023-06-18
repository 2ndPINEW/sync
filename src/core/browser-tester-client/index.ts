import { logInfo } from "./utils/logger";
import { onError$ } from "./services/error-handler";
import { WebSocketService } from "./services/websocket";

logInfo("INFO", "Initializing...");

try {
  const ws = new WebSocketService();
  onError$.subscribe((error) => {
    logInfo("Detect RuntimeError", error);
  });
} catch (error) {
  logInfo("INFO", "Initialize failed", error);
} finally {
  logInfo("INFO", "Initialized");
}
