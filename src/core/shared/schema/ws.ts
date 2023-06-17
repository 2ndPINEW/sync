export type WsServerChunk = WsServerChunkProps & ChunkSharedProps;

export type WsClientChunk = WsClientChunkProps & ChunkSharedProps;

type WsServerChunkProps = {};

type WsClientChunkProps =
  | {
      kind: "connect";
    }
  | {
      kind: "message";
    }
  | {
      kind: "disconnect";
    };

type ChunkSharedProps = {
  clientId: string;
};
