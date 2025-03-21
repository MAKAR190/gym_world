import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import eslintPluginUnusedImports from "eslint-plugin-unused-imports";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("@react-native-community"),
  {
    plugins: {
      "unused-imports": eslintPluginUnusedImports,
    },
    ignores: [
      "node_modules",
      "dist",
      "build",
      ".expo",
      "web-build",
      ".vscode",
      ".gitignore",
      ".prettierrc",
      ".eslintrc.js",
    ],
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/func-call-spacing": ["error", "never"],
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
    },
  },
];

export default eslintConfig;
