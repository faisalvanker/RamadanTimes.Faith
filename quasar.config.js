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

    extras: ["material-icons"],

    build: {
      target: {
        browser: ["es2019", "edge88", "firefox78", "chrome87", "safari13.1"],
        node: "node20",
      },

      vueRouterMode: "hash",
      htmlMinifyOptions: {
        removeAttributeQuotes: false,
      },
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
      extendGenerateSWOptions(cfg) {
        cfg.globIgnores = cfg.globIgnores || [];
        cfg.globIgnores.push(
          "**/statics/data/city/**",
          "**/statics/data/info.csv",
          "**/statics/data/significant_dates.csv",
          "**/statics/data/islamic_months.csv",
          "**/statics/data/config.json",
          "**/icons/apple-launch-*.png",
          "**/icons/screenshot-*.png",
          "**/_headers"
        );
        cfg.runtimeCaching = [
          {
            urlPattern: /statics\/data\/config\.json/,
            handler: "NetworkFirst",
            options: {
              cacheName: "ramadan-config-cache",
              expiration: {
                maxEntries: 2,
                maxAgeSeconds: 10 * 24 * 60 * 60,
              },
            },
          },
          {
            urlPattern: /statics\/data\/city\/.*\.csv/,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "city-timetables-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 10 * 24 * 60 * 60, // 10 days
              },
            },
          },
          {
            urlPattern:
              /statics\/data\/(info|significant_dates|islamic_months)\.csv/,
            handler: "NetworkFirst",
            options: {
              cacheName: "ramadan-info-cache",
              expiration: {
                maxEntries: 5,
                maxAgeSeconds: 10 * 24 * 60 * 60, // 10 days
              },
            },
          },
        ];
      },
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
