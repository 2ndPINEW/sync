import { timer } from "rxjs";
import {
  PlatformInfo,
  WsClientChunk,
  WsServerChunk,
} from "../../shared/schema/ws";
import { ProxyServer } from "./proxy-server";

interface Client {
  id: string;
  platformInfo: PlatformInfo;
  lastActiveAt: number;
}

export class ClientService {
  private _server: ProxyServer;

  private _clients: Client[] = [];

  constructor() {
    this._server = new ProxyServer();

    this._server.wsClientChunk$.subscribe((chunk) => {
      this.onReceive(chunk);
    });

    // FIXME: クライアントが増えるたびに ping リクエストが増えてるかも？？
    timer(0, 5000).subscribe(() => {
      this.dropInactiveClients();
      this._server.wsSend({
        type: "ping",
        clientId: "*",
      });
    });
  }

  onReceive(chunk: WsClientChunk) {
    if (chunk.type === "pong") {
      this.updateLastActiveAt(chunk.clientId);
    }
    if (chunk.type === "load") {
      this._clients.push({
        id: chunk.clientId,
        platformInfo: chunk.platformInfo,
        lastActiveAt: Date.now(),
      });
    }
  }

  private updateLastActiveAt(clientId: string) {
    const client = this._clients.find((client) => client.id === clientId);
    if (client) {
      client.lastActiveAt = Date.now();
    }
  }

  private dropInactiveClients() {
    const now = Date.now();
    this._clients = this._clients.filter(
      (client) => now - client.lastActiveAt < 8000
    );
    console.log(this._clients);
  }

  send(chunk: WsServerChunk) {
    this._server.wsSend(chunk);
  }
}
