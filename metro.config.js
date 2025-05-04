const { withNativeWind } = require("nativewind/metro");
const { getSentryExpoConfig } = require("@sentry/react-native/metro");

const config = getSentryExpoConfig(__dirname);

config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve("react-native-svg-transformer"),
};

config.resolver = {
  ...config.resolver,
  assetExts: config.resolver.assetExts.filter((ext) => ext !== "svg"),
  sourceExts: [...config.resolver.sourceExts, "svg"],
  extraNodeModules: {
    ...config.resolver.extraNodeModules,
    "@": require("path").resolve(__dirname, "app"),
    buffer: require.resolve("buffer/"),
    process: require.resolve("process/browser"),
    crypto: require.resolve("react-native-crypto"),
    stream: require.resolve("stream-browserify"),
    events: require.resolve("events/"),
    https: require.resolve("https-browserify"),
    http: require.resolve("http-browserify"),
    ws: require.resolve("react-native-websocket"),
  },
};

config.resolver.unstable_enablePackageExports = false;

module.exports = withNativeWind(config, { input: "./global.css" });
