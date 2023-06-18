import { BehaviorSubject, timer } from "rxjs";
import {
  PlatformInfo,
  WsClientChunk,
  WsServerChunk,
} from "../../shared/schema/ws";
import { ProxyServer } from "./proxy-server";
import { mkdirSync, writeFileSync } from "fs";
import DomParser from "dom-parser";

const parser = new DomParser();

export interface Client {
  id: string;
  platformInfo: PlatformInfo;
  lastActiveAt: number;
  idleLogs: Extract<WsClientChunk, { type: "idle" }>[];
}

export class ClientService {
  private _server: ProxyServer;

  private _clients$: BehaviorSubject<Client[]> = new BehaviorSubject([] as any);

  private paths: {
    path: string;
    checked: boolean;
  }[] = [];

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
      // /.cache/ に chunk.screenshot を保存する
      const buf = Buffer.from(
        chunk.screenshot.replace(/^data:image\/png;base64,/, ""),
        "base64"
      );
      mkdirSync(`.cache/${chunk.clientId}`, { recursive: true });
      writeFileSync(`.cache/${chunk.clientId}/${chunk.id}.png`, buf);
      chunk.screenshot = "";

      const dom = parser.parseFromString(chunk.html);
      const aTags = dom.getElementsByTagName("a");
      const hrefs = aTags.map((aTag) => aTag.getAttribute("href"));
      hrefs.forEach((href) => {
        const alreadyExists = this.paths.find((path) => path.path === href);
        if (href && !alreadyExists) {
          this.paths.push({
            path: href,
            checked: false,
          });
        }
      });

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

  start() {
    timer(0, 5000).subscribe(() => {
      this.paths.forEach((path) => {
        this._clients$.value.forEach((client) => {
          client.idleLogs.forEach((log) => {
            if (log.path === path.path) {
              path.checked = true;
            }
          });
        });
      });
      const targetPath = this.paths.find((path) => !path.checked);
      if (targetPath) {
        this._server.wsSend({
          type: "request-page-open",
          clientId: "*",
          path: targetPath.path,
        });
      } else {
        console.log("all paths are checked");
      }
    });
  }
}
