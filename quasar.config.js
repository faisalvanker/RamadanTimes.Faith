/* eslint-env node */

/*
 * This file runs in a Node context (it's NOT transpiled by Babel), so use only
 * the ES6 features that are supported by your Node version. https://node.green/
 */

// Configuration for your app
// https://v2.quasar.dev/quasar-cli-vite/quasar-config-js

import { configure } from "quasar/wrappers";

export default configure(function (/* ctx */) {
  return {
    eslint: {
      warnings: true,
      errors: true,
    },

    boot: [],

    css: ["app.scss"],

    extras: ["roboto-font", "material-icons"],

    build: {
      target: {
        browser: ["es2019", "edge88", "firefox78", "chrome87", "safari13.1"],
        node: "node20",
      },

      vueRouterMode: "hash",
    },

    devServer: {
      open: true,
      port: 9000, // ADD THIS PORT FROM YOUR EARLIER OUTPUT
    },

    framework: {
      config: {},
      plugins: ["Dialog", "LocalStorage", "Notify"],
    },

    animations: [],

    ssr: {
      pwa: false,
      prodPort: 3000,
      middlewares: ["render"],
    },

    pwa: {
      workboxMode: "GenerateSW",
      injectPwaMetaTags: true,
      swFilename: "sw.js",
      manifestFilename: "manifest.json",
      useCredentialsForManifestTag: false,
    },

    cordova: {},

    capacitor: {
      hideSplashscreen: true,
    },

    electron: {
      inspectPort: 5858,
      bundler: "packager",
      packager: {},
      builder: {
        appId: "quasar-project",
      },
    },

    bex: {
      contentScripts: ["my-content-script"],
    },
  };
});
