const path = require("path");
const webpack = require('webpack');

module.exports = {
  entry: {
    "spubg": "./index.js",
    "spubg.bin": "./bin/spubg.bin.js"
  },

  mode: "production",

  output: {
    path: path.resolve(__dirname, "dist"),
    library: "spubg",
    libraryTarget: "umd",
    globalObject: "typeof self !== 'undefined' ? self : this"
  },

  target: "node",
  
  plugins: [
    // Adds shebang to the binary
    new webpack.BannerPlugin({
      banner: '#!/usr/bin/env node',
      raw: true,
      include: /^spubg.bin/
    })
  ]
};
