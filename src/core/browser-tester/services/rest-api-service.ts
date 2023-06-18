import fastify, { FastifyInstance } from "fastify";
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

    this._server.get("/clients/:clientId", async (request, reply) => {
      const client = this._clients.find(
        (client) => client.id === (request.params as any).clientId
      );
      if (!client) {
        reply.status(404);
        return;
      }
      reply.send(
        JSON.stringify({
          ...client,
          idleLogs: client.idleLogs.map((log) => {
            return {
              ...log,
              screenshot: null,
              html: null,
            };
          }),
        })
      );
    });

    this._server.get("/clients/:clientId/:logId", async (request, reply) => {
      const client = this._clients.find(
        (client) => client.id === (request.params as any).clientId
      );
      if (!client) {
        reply.status(404);
        return;
      }
      const log = client.idleLogs.find(
        (log) => log.id === (request.params as any).logId
      );
      if (!log) {
        reply.status(404);
        return;
      }
      reply.send(JSON.stringify(log));
    });

    this._server.listen({ port: ports.managementApi.port }).then((address) => {
      logInfo(`Server listening on ${address}`);
    });
  }

  updateClients(clients: Client[]) {
    this._clients = clients;
  }
}
