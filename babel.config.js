module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./app"],
          alias: {
            "@": "./app",
          },
        },
      ],
      [
        "module:react-native-dotenv",
        {
          moduleName: "@env",
          path: ".env",
          blacklist: null,
          whitelist: [
            "EXPO_PUBLIC_WORKOUT_REWARDS_ADDRESS",
            "EXPO_PUBLIC_GWC_TOKEN_ADDRESS",
            "EXPO_PUBLIC_METAMASK_PRIVATE_KEY",
            "EXPO_PUBLIC_ALCHEMY_API_KEY",
          ],
          safe: false,
          allowUndefined: false,
        },
      ],
    ],
  };
};
