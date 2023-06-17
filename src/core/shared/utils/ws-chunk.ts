import { WsClientChunk, WsServerChunk } from "../schema/ws";

// TODO: スキーマから型安全にする
export const stringToServerChunk = (str: string): WsServerChunk => {
  return JSON.parse(str);
};

export const stringToClientChunk = (str: string): WsClientChunk => {
  return JSON.parse(str);
};

export const serverChunkToString = (chunk: WsServerChunk): string => {
  return JSON.stringify(chunk);
};

export const clientChunkToString = (chunk: WsClientChunk): string => {
  return JSON.stringify(chunk);
};
