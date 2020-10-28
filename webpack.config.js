const path = require("path");
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin')
var nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: {
    "spubg": "./src/index.js",
    "spubg.bin": "./bin/spubg.bin.js",
    "bot": "./src/bot/discordBot.js",
    "testlet": "./src/testlet.js"
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
    }),

    new CircularDependencyPlugin({
      // exclude detection of files based on a RegExp
      exclude: /a\.js|node_modules/,
      // add errors to webpack instead of warnings
      failOnError: false,
      // set the current working directory for displaying module paths
      cwd: process.cwd(),
    })
  ],
  externals: [nodeExternals()], // in order to ignore all modules in node_modules folder
};
