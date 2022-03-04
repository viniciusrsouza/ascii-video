const path = require("path");
const html = require("html-webpack-plugin");
const clean = require("clean-webpack-plugin");

module.exports = {
  entry: path.resolve(__dirname, "src/index.ts"),
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "public"),
      publicPath: "/",
    },
    compress: true,
    port: 8080,
  },
  plugins: [
    new html({
      template: path.resolve(__dirname, "public/index.html"),
      filename: "index.html",
    }),
    new clean.CleanWebpackPlugin(),
  ],
};
