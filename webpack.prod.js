const path = require("path");
const webpack = require("webpack");
// const nodeExternals = require("webpack-node-externals");

function resolve(dir) {
  return path.join(__dirname, ".", dir);
}

module.exports = {
  entry: "./src/index.js",
  // externals: [nodeExternals()],
  output: {
    path: path.resolve(__dirname, "./dist"),
    publicPath: "/dist/",
    filename: "el-extend.js",
    libraryTarget: "commonjs2"
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["vue-style-loader", "css-loader"]
      },
      {
        test: /\.scss$/,
        use: ["vue-style-loader", "css-loader", "sass-loader"]
      },
      {
        test: /\.sass$/,
        use: ["vue-style-loader", "css-loader", "sass-loader?indentedSyntax"]
      },
      {
        test: /\.vue$/,
        loader: "vue-loader",
        options: {
          loaders: {
            // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
            // the "scss" and "sass" values for the lang attribute to the right configs here.
            // other preprocessors should work out of the box, no loader config like this necessary.
            scss: ["vue-style-loader", "css-loader", "sass-loader"],
            sass: [
              "vue-style-loader",
              "css-loader",
              "sass-loader?indentedSyntax"
            ]
          }
          // other vue-loader options go here
        }
      },
      {
        test: /\.js$/,
        loader: "babel-loader",
        // exclude: /node_modules/,
        include: [resolve("src"), resolve("node_modules/element-ui")]
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: "file-loader",
        options: {
          name: "[name].[ext]?[hash]"
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: "url-loader",
        options: {
          limit: 10000,
          name: path.resolve(
            __dirname,
            "./dist/satic/fonts/[name].[hash:7].[ext]"
          )
        }
      }
    ]
  },
  resolve: {
    alias: {
      vue$: "vue/dist/vue.esm.js",
      "@": resolve("src"),
      "@components": resolve("src/components")
    },
    extensions: ["*", ".js", ".vue", ".json"]
  },
  externals: [
    {
      vue: {
        root: "Vue",
        commonjs: "vue",
        commonjs2: "vue",
        amd: "vue"
      }
    },
    "element-ui/lib/input",
    "element-ui/lib/scrollbar",
    "element-ui/lib/input",
    "element-ui/lib/button",
    "element-ui/lib/dropdown",
    "element-ui/lib/dropdown-menu",
    "element-ui/lib/dropdown-item",
  ],
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    overlay: true
  },
  performance: {
    hints: false
  },
  devtool: "#eval-source-map"
};
