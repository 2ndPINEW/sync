import { BehaviorSubject, timer } from "rxjs";
import {
  PlatformInfo,
  WsClientChunk,
  WsServerChunk,
} from "../../shared/schema/ws";
import { ProxyServer } from "./proxy-server";

export interface Client {
  id: string;
  platformInfo: PlatformInfo;
  lastActiveAt: number;
  idleLogs: Extract<WsClientChunk, { type: "idle" }>[];
}

export class ClientService {
  private _server: ProxyServer;

  private _clients$: BehaviorSubject<Client[]> = new BehaviorSubject([] as any);

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
      this._clients$.next(
        this._clients$.value.concat({
          id: chunk.clientId,
          platformInfo: chunk.platformInfo,
          lastActiveAt: Date.now(),
          idleLogs: [],
        })
      );
    }
    if (chunk.type === "idle") {
      this._clients$.next(
        this._clients$.value.map((client) => {
          if (client.id === chunk.clientId) {
            return {
              ...client,
              idleLogs: client.idleLogs.concat(chunk),
            };
          }
          return client;
        })
      );
    }
  }

  private updateLastActiveAt(clientId: string) {
    this._clients$.next(
      this._clients$.value.map((client) => {
        if (client.id === clientId) {
          return {
            ...client,
            lastActiveAt: Date.now(),
          };
        }
        return client;
      })
    );
  }

  private dropInactiveClients() {
    const now = Date.now();
    this._clients$.next(
      this._clients$.value.filter((client) => now - client.lastActiveAt < 8000)
    );
  }

  send(chunk: WsServerChunk) {
    this._server.wsSend(chunk);
  }

  get clients$() {
    return this._clients$;
  }
}
