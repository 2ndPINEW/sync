import ports from "../../shared/constants/ports";
import paths from "../../shared/constants/paths";
import {
  clientChunkToString,
  stringToServerChunk,
} from "../../shared/utils/ws-chunk";
import { logInfo } from "../utils/logger";
import { clientId, getCurrentPath, getPlatformInfo } from "../utils/client";

const hostname = window.location.hostname;
const url = `ws://${hostname}:${ports.proxy.port}${paths.ws.path}`;

logInfo("Connecting to", url);
const socket = new WebSocket(url);

socket.addEventListener("open", (event) => {
  logInfo("Connected", event);
  socket.send(
    clientChunkToString({
      clientId: clientId,
      type: "load",
      path: getCurrentPath(),
      platformInfo: getPlatformInfo(),
    })
  );
});

// メッセージの待ち受け
socket.addEventListener("message", (event) => {
  logInfo("Received message", event.data);
  const chunk = stringToServerChunk(event.data);
  if (chunk.type === "request-page-open") {
    console.log("request-page-open", chunk.path);
    window.location.href = chunk.path;
  }
});

export const send = (message: string) => {
  socket.send(
    clientChunkToString({
      clientId: clientId,
      type: "message",
    })
  );
};
