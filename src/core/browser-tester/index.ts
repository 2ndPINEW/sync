import { WsClientChunk, WsServerChunk } from "../shared/schema/ws";
import { ProxyServer } from "./proxy-server";

export class BrowserTester {
  server: ProxyServer;

  constructor() {
    this.server = new ProxyServer();

    this.server.wsClientChunk$.subscribe((chunk) => {
      this.onReceive(chunk);
    });
  }

  onReceive(chunk: WsClientChunk) {}

  send(chunk: WsServerChunk) {
    this.server.wsSend(chunk);
  }
}
