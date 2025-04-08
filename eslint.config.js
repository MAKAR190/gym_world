const { FlatCompat } = require("@eslint/eslintrc");
const eslintPluginUnusedImports = require("eslint-plugin-unused-imports");
const eslintPluginTypescript = require("@typescript-eslint/eslint-plugin");
const typescriptParser = require("@typescript-eslint/parser");

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: {},
});

module.exports = [
  ...compat.extends("@react-native-community"),
  {
    ignores: [
      "node_modules", 
      "dist",
      "build",
      ".expo",
      "web-build",
      ".vscode",
      ".gitignore",
      ".prettierrc",
    ],
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      "@typescript-eslint": eslintPluginTypescript,
      "unused-imports": eslintPluginUnusedImports,
    },
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      quotes: ["off"],
      "eol-last": ["off"],
      "react/react-in-jsx-scope": ["off"],
      "no-trailing-spaces": ["off"],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          vars: "all",
          args: "all",
          ignoreRestSiblings: false,
          argsIgnorePattern: "^_",
        },
      ],
      "unused-imports/no-unused-imports": "error",
      "@typescript-eslint/func-call-spacing": "off",
      "prettier/prettier": "off",
      "react-native/no-inline-styles": "off",
      "curly": "off",
    },
  },
];
