export type WsServerChunk = WsServerChunkProps & ChunkSharedProps;

export type WsClientChunk = WsClientChunkProps & ChunkSharedProps;

type WsServerChunkProps =
  | {
      type: "ping";
    }
  | {
      type: "request-page-open";
      path: string;
    };

type WsClientChunkProps =
  // ページを開いた時に送る(接続イベントも含める)
  | {
      type: "load";
      path: string;
      platformInfo: PlatformInfo;
    }
  | {
      type: "idle";
      path: string;
      html: string;
    }
  | {
      type: "pong";
    }
  // 切断
  | {
      type: "disconnect";
    };

type ChunkSharedProps = {
  clientId: string | "*";
};

export type PlatformInfo = {
  os: string;
  browser: string;
  version: string;
  screen: {
    width: number;
    height: number;
  };
  language: string;
};
