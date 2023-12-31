export default {
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
  // API用のポート
  managementApi: {
    port: 4637,
  },
};
