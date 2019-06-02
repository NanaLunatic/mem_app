'use strict'
// Template version: 1.2.4
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

module.exports = {
  dev: {
    // Paths
    assetsSubDirectory: '/static',
    assetsPublicPath: '/',
    proxyTable: {
      '/g1': {
        target: 'http://192.168.1.11:10080',
        // target: 'http://192.168.1.123:8088',
        changeOrigin: true,
        pathRewrite: {
          '^/g1': '/g1'
        },
        logLevel: 'debug'
      },
      '/images': {
        target: 'http://192.168.1.11:10080',
        // target: 'http://192.168.1.123:8088',
        changeOrigin: true,
        pathRewrite: {
          '^/images': '/images'
        },
        logLevel: 'debug'
      }
    },

    // Various Dev Server settings
    host: '0.0.0.0', // can be overwritten by process.env.HOST
    port: 8888, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    // Use Eslint Loader?
    // If true, your code will be linted during bundling and
    // linting errors and warnings will be shown in the console.
    useEslint: true,
    // If true, eslint errors and warnings will also be shown in the error overlay
    // in the browser.
    showEslintErrorsInOverlay: false,
    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false,
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: './static',
    assetsPublicPath: './',

    /**
     * Source Maps
     */

    productionSourceMap: true,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  },
  prod: {
    env: require('./prod.env'),
    port: 8081,
    proxyTable: {
      '/g1': {
        target: 'http://127.0.0.1:10080',
        changeOrigin: true,
        pathRewrite: {
          '^/g1': '/g1'
        },
        logLevel: 'debug'
      },
      '/images': {
        target: 'http://127.0.0.1:10080',
        changeOrigin: true,
        pathRewrite: {
          '^/images': '/images'
        },
        logLevel: 'debug'
      }
    }
  },
  sit: {
    env: require('./sit.env'),
    port:60,
    proxyTable: {
      '/g1': {
        target: 'http://192.168.1.200:10080',
        changeOrigin: true,
        pathRewrite: {
          '^/g1': '/g1'
        },
        logLevel: 'debug'
      },
      '/images': {
        target: 'http://192.168.1.200:10080',
        changeOrigin: true,
        pathRewrite: {
          '^/images': '/images'
        },
        logLevel: 'debug'
      }
    }
  },
  zc: {
    env: require('./zc.env'),
    port:8082,
    proxyTable: {
      '/g1': {
        target: 'http://127.0.0.1:10080',
        changeOrigin: true,
        pathRewrite: {
          '^/g1': '/g1'
        },
        logLevel: 'debug'
      },
      '/images': {
        target: 'http://127.0.0.1:10080',
        changeOrigin: true,
        pathRewrite: {
          '^/images': '/images'
        },
        logLevel: 'debug'
      }
    }
  }
}
