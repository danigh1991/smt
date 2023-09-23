const {
  override,
  fixBabelImports,
  addBabelPlugin,
  addLessLoader,
  addWebpackAlias,
  babelInclude,
  adjustStyleLoaders,
  addDecoratorsLegacy,
} = require("customize-cra");
const path = require("path");

module.exports = {
  paths: (paths, env) => {
    paths.appBuild = path.resolve(__dirname, "dist");
    return paths;
  },
  webpack: override(
    fixBabelImports("import", {
      libraryName: "antd",
      libraryDirectory: "es",
      style: true,
    }),
    addBabelPlugin("babel-plugin-syntax-dynamic-import"),
    addDecoratorsLegacy(),
    addLessLoader({
      javascriptEnabled: true,
    }),
    addWebpackAlias({
      ["moment"]: "antd-jalali-moment",
    }),
    adjustStyleLoaders(({ use: [, css, postcss, resolve, processor] }) => {
      css.options.sourceMap = true; // css-loader
      postcss.options.sourceMap = true; // postcss-loader
      // when enable pre-processor,
      // resolve-url-loader will be enabled too
      if (resolve) {
        resolve.options.sourceMap = true; // resolve-url-loader
        resolve.options.removeCR = true; // resolve-url-loader
      }
      // pre-processor
      if (processor && processor.loader.includes("sass-loader")) {
        processor.options.sourceMap = true; // sass-loader
      }
    }),
    babelInclude([path.resolve("src")])
  ),
};
