const { withNativeWind } = require("nativewind/metro");
const { getSentryExpoConfig } = require("@sentry/react-native/metro");

const config = getSentryExpoConfig(__dirname);

config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve("react-native-svg-transformer"),
};

config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true,
  },
});

config.resolver.extraNodeModules = {
  ...require("node-libs-expo"),
};
config.resolver = {
  ...config.resolver,
  assetExts: config.resolver.assetExts.filter((ext) => ext !== "svg"),
  sourceExts: [...config.resolver.sourceExts, "svg"],
  alias: {
    "node:crypto": require.resolve("./crypto-shim.js"),
    crypto: require.resolve("./crypto-shim.js"),
  },
  extraNodeModules: {
    ...config.resolver.extraNodeModules,
    "@": require("path").resolve(__dirname, "app"),
    buffer: require.resolve("buffer/"),
    process: require.resolve("process/browser"),
    crypto: require.resolve("./crypto-shim.js"),
    "node:crypto": require.resolve("./crypto-shim.js"),
    stream: require.resolve("stream-browserify"),
    events: require.resolve("events/"),
    https: require.resolve("https-browserify"),
    http: require.resolve("http-browserify"),
    ws: require.resolve("react-native-websocket"),
    util: require.resolve("util/"),
    url: require.resolve("url/"),
    assert: require.resolve("assert/"),
    "react-native": require.resolve("react-native"),
  },
};

config.resolver.unstable_enablePackageExports = false;

// Enable environment variables
config.transformer.minifierConfig = {
  keep_classnames: true,
  keep_fnames: true,
  mangle: {
    keep_classnames: true,
    keep_fnames: true,
  },
};

module.exports = withNativeWind(config, { input: "./global.css" });
