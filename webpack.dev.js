const path = require("path");
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "development",

  output: {
    filename: "[name].js",
  },

  devtool: "inline-source-map",

  devServer: {
    static: path.resolve(__dirname, "dist"),
    open: true,
    hot: true,
    port: 8080,
  },

  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },

  plugins: [],
});
