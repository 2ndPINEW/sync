import ports from "../../shared/constants/ports";
import paths from "../../shared/constants/paths";
import {
  clientChunkToString,
  stringToServerChunk,
} from "../../shared/utils/ws-chunk";
import { logInfo, logWarn } from "../utils/logger";
import { clientId, getCurrentPath, getPlatformInfo } from "../utils/client";
import { WsClientChunk, WsServerChunk } from "../../shared/schema/ws";
import { Subject, timer } from "rxjs";

export class WebSocketService {
  private socket!: WebSocket;

  private _message$ = new Subject<WsServerChunk>();

  private _isConnected = false;

  constructor() {
    this.connect();
  }

  private connect() {
    const hostname = window.location.hostname;
    const url = `ws://${hostname}:${ports.proxy.port}${paths.ws.path}`;
    logInfo("Connecting to", url);
    this.socket = new WebSocket(url);

    this.socket.addEventListener("open", (event) => {
      logInfo("Connected", event);
      this.socket.send(
        clientChunkToString({
          clientId: clientId,
          type: "load",
          path: getCurrentPath(),
          platformInfo: getPlatformInfo(),
        })
      );
      this._isConnected = true;
    });

    this.socket.addEventListener("message", (event) => {
      logInfo("Received message", event.data);
      const chunk = stringToServerChunk(event.data);
      if (chunk.clientId === clientId || chunk.clientId === "*") {
        this._message$.next(chunk);
      }
    });
  }

  get message$() {
    return this._message$.asObservable();
  }

  send(chunk: WsClientChunk, retry = 0) {
    if (retry > 10) {
      logWarn("Retry over 10 times. Stop retrying.", chunk);
      return;
    }
    if (!this._isConnected) {
      timer(1000).subscribe(() => {
        this.send(chunk, retry + 1);
      });
      return;
    }
    this.socket.send(clientChunkToString(chunk));
  }

  // TODO: 画面閉じたりリロードする前に切断するようにする
  close() {
    this.send({
      type: "disconnect",
      clientId,
    });
    this.socket.close();
  }
}
