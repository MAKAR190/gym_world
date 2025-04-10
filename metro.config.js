const { withNativeWind } = require("nativewind/metro");
const { getSentryExpoConfig } = require("@sentry/react-native/metro");
const { getDefaultConfig } = require("expo/metro-config");

const config = getSentryExpoConfig(__dirname);

const expoConfig = getDefaultConfig(__dirname);

expoConfig.resolver = {
  ...expoConfig.resolver,
  extraNodeModules: {
    ...expoConfig.resolver.extraNodeModules,
    "@": require("path").resolve(__dirname, "app"),
  },
};

module.exports = withNativeWind(config, { input: "./global.css" });