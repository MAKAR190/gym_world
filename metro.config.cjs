import { withNativeWind } from "nativewind/metro";
import {
  getSentryExpoConfig
} from "@sentry/react-native/metro";

const config = getSentryExpoConfig(__dirname);

module.exports = withNativeWind(config, { input: "./global.css" });