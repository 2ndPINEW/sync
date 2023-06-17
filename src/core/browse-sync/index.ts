import { init, type BrowserSyncInstance } from "browser-sync";
import config from "../../config";
import historyApiFallback from "connect-history-api-fallback";

export class BrowserSync {
  private _instance: BrowserSyncInstance;

  constructor() {
    this._instance = init({
      port: config.sync.port,
      ui: {
        port: config.sync.ui.port,
      },
      open: true,
      middleware: [historyApiFallback()],
    });
  }

  public get instance() {
    return this._instance;
  }
}
