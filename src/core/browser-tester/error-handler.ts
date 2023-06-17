import { fromEvent, merge } from "rxjs";

const onWindowError$ = fromEvent(window, "error");
const onWindowUnhandledRejection$ = fromEvent(window, "unhandledrejection");

export const onError$ = merge(onWindowError$, onWindowUnhandledRejection$);
