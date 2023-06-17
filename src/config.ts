export default {
  // 最後のスラッシュはいらない
  target: "http://localhost:4200",
  // "username:password"
  auth: "",
  sync: {
    // browser-syncのポート
    port: 4635,
    ui: {
      port: 4201,
    },
  },
  // リバースプロキシでアプリケーション動かすポート
  proxy: {
    port: 4636,
  },
};
