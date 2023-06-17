import fastify, { FastifyInstance } from "fastify";
import fastifyStatic from "@fastify/static";
import fastifyWebsocket from "@fastify/websocket";
import config from "../config";
import fetch from "node-fetch";
import path from "path";
import {
  browserSyncScriptTemplate,
  browserTesterScriptTemplate,
} from "./templates/index";
import { Subject } from "rxjs";
import { WsClientChunk, WsServerChunk } from "./shared/schema/ws";
import paths from "./shared/constants/paths";
import ports from "./shared/constants/ports";

export class ProxyServer {
  private _server: FastifyInstance;

  private _wsClientChunk$ = new Subject<WsClientChunk>();
  private _wsServerChunk$ = new Subject<WsServerChunk>();

  constructor() {
    this._server = fastify({
      logger: false,
    });

    // Client Script を配信する
    this._server.register(fastifyStatic, {
      root: path.join(__dirname, "../../dist/browser-tester-client"),
      prefix: paths.clientScript.root,
    });

    this._server.register(fastifyWebsocket);
    this._server.register(async (fastify) => {
      fastify.get(paths.ws.path, { websocket: true }, (connection, req) => {
        connection.socket.on(
          "message",
          (data: Buffer | ArrayBuffer | Buffer[], isBinary) => {
            if (isBinary) {
              return;
            }
            const stringData =
              data instanceof Buffer
                ? data.toString()
                : data instanceof ArrayBuffer
                ? Buffer.from(data).toString()
                : Buffer.concat(data).toString();
            const parsedData = JSON.parse(stringData) as WsClientChunk;
            this._wsClientChunk$.next(parsedData);
            console.log("WS Receive:", parsedData);
          }
        );
        this._wsServerChunk$.subscribe((data) => {
          connection.socket.send(JSON.stringify(data));
          console.log("WS Send:", data);
        });
      });
    });

    this._server.setNotFoundHandler(async (req, res) => {
      const url = `${config.target}${req.url}`;

      const response = await fetch(url, {
        headers: {
          // TODO: Fix
          // Authorization: `Basic ${config.auth}`,
          // ...(req.headers as any),
        },
      });

      response.headers.forEach((value, key) => {
        const lowerKey = key.toLowerCase();
        if (
          lowerKey !== "transfer-encoding" &&
          lowerKey !== "content-encoding"
        ) {
          res.header(key, value);
        }
      });
      res.status(response.status);

      const contentType = response.headers.get("content-type");
      if (contentType?.includes("text/html")) {
        const body = await response.text();
        const newBody = body
          .replace("<body>", `<body>${browserSyncScriptTemplate}`)
          .replace("<head>", `<head>${browserTesterScriptTemplate}`);
        res.send(newBody);
      } else {
        const body = await response.buffer();
        res.send(body);
      }
    });

    this._server.listen({ port: ports.proxy.port }).then((address) => {
      console.log(`Server listening on ${address}`);
    });
  }

  get server(): FastifyInstance {
    return this._server;
  }

  get wsClientChunk$(): Subject<WsClientChunk> {
    return this._wsClientChunk$;
  }

  wsSend(data: WsServerChunk) {
    this._wsServerChunk$.next(data);
  }
}
