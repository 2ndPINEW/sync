export type WsServerChunk = WsServerChunkProps & ChunkSharedProps;

export type WsClientChunk = WsClientChunkProps & ChunkSharedProps;

type WsServerChunkProps = {};

type WsClientChunkProps =
  | {
      kind: "connect";
    }
  | {
      kind: "disconnect";
    };

type ChunkSharedProps = {
  id: string;
};
