import { logInfo } from "./logger";
import { onError$ } from "./error-handler";

logInfo("INFO", "Initializing...");

try {
  onError$.subscribe((error) => {
    logInfo("Detect RuntimeError", error);
  });
} catch (error) {
  logInfo("INFO", "Initialize failed", error);
} finally {
  logInfo("INFO", "Initialized");
}
