import { init, type BrowserSyncInstance } from "browser-sync";
import historyApiFallback from "connect-history-api-fallback";
import ports from "../shared/constants/ports";

export class BrowserSync {
  private _instance: BrowserSyncInstance;

  constructor() {
    this._instance = init({
      port: ports.sync.port,
      ui: {
        port: ports.sync.ui.port,
      },
      open: true,
      middleware: [historyApiFallback()],
    });
  }

  public get instance() {
    return this._instance;
  }
}
