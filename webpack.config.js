const path = require("path");
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: {
    "spubg": "./src/index.js",
    "spubg.bin": "./bin/spubg.bin.js"
  },

  mode: "development",

  output: {
    path: path.resolve(__dirname, "dist"),
    library: "spubg",
    libraryTarget: "umd",
    globalObject: "typeof self !== 'undefined' ? self : this"
  },

  target: "node",
  
  // Enable if you want sourcemaps on build
  devtool: "inline-source-map",

  plugins: [
    // clean
    new CleanWebpackPlugin(),

    // Adds shebang to the binary
    new webpack.BannerPlugin({
      banner: '#!/usr/bin/env node',
      raw: true,
      include: /^spubg.bin/
    })
  ]
};
