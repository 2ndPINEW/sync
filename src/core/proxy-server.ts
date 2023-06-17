import fastify, { FastifyInstance } from "fastify";
import fastifyStatic from "@fastify/static";
import config from "../config";
import fetch from "node-fetch";
import path from "path";
import {
  browserSyncScriptTemplate,
  browserTesterScriptTemplate,
} from "./templates/index";

export class ProxyServer {
  private _server: FastifyInstance;

  constructor() {
    this._server = fastify({
      logger: false,
    });

    this._server.register(fastifyStatic, {
      root: path.join(__dirname, "../../dist/browser-tester"),
      prefix: "/browser-tester-static/",
    });

    this._server.setNotFoundHandler(async (req, res) => {
      const url = `${config.target}${req.url}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Basic ${config.auth}`,
          ...(req.headers as any),
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
      res.header(
        "cache-control",
        "no-store, no-cache, must-revalidate, proxy-revalidate"
      );
      res.status(response.status);

      const contentType = response.headers.get("content-type");
      if (contentType?.includes("text/html")) {
        const body = await response.text();
        const newBody = body.replace(
          "</body>",
          `${browserSyncScriptTemplate}${browserTesterScriptTemplate}</body>`
        );
        res.send(newBody);
      } else {
        const body = await response.buffer();
        res.send(body);
      }
    });

    this._server.listen({ port: config.proxy.port }).then((address) => {
      console.log(`Server listening on ${address}`);
    });
  }

  get server(): FastifyInstance {
    return this._server;
  }
}
