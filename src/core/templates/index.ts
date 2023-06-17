import config from "../../config";
import paths from "../shared/constants/paths";

export const browserTesterScriptTemplate = `
<script src="${paths.clientScript.root}${paths.clientScript.path}?v=0"></script>
`;

export const browserSyncScriptTemplate = `
<script id="__bs_script__">//<![CDATA[
  (function() {
    try {
      var script = document.createElement('script');
      if ('async') {
        script.async = true;
      }
      script.src = 'http://HOST:${config.sync.port}/browser-sync/browser-sync-client.js?v=2.29.3'.replace("HOST", location.hostname);
      if (document.body) {
        document.body.appendChild(script);
      } else if (document.head) {
        document.head.appendChild(script);
      }
    } catch (e) {
      console.error("Browsersync: could not append script tag", e);
    }
  })()
//]]></script>`;
