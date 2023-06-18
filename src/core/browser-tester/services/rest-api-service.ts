import fastify, { FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import ports from "../../shared/constants/ports";
import { logInfo } from "../utils/logger";
import { Client } from "./client-service";

// Copilot の赴くまま雑にコードを出した
// clients の管理も終わってるし後で直す
export class RestApiServer {
  private _server: FastifyInstance;
  private _clients: Client[] = [];

  constructor() {
    this._server = fastify();

    this._server.register(cors, {});

    this._server.get("/clients", async (request, reply) => {
      const clients = this._clients.map((client) => {
        return {
          ...client,
          idleLogs: client.idleLogs.map((log) => {
            return {
              ...log,
              screenshot: null,
              html: null,
            };
          }),
        };
      });
      reply.send(JSON.stringify(clients));
    });

    this._server.get("/start", async (request, reply) => {
      this.start();
    });

    this._server.listen({ port: ports.managementApi.port }).then((address) => {
      logInfo(`Server listening on ${address}`);
    });
  }

  updateClients(clients: Client[]) {
    this._clients = clients;
  }

  handlers: Array<() => void> = [];
  addOnStartCallback(handler: () => void) {
    this.handlers.push(handler);
  }

  isStarted = false;
  start() {
    if (this.isStarted) {
      return;
    }
    this.isStarted = true;
    this.handlers.forEach((handler) => handler());
  }
}
