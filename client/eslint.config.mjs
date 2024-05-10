import {FlatCompat} from "@eslint/eslintrc";
import path from "path";
import {fileURLToPath} from "url";

const __filename= fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname
});

export default [
  ...compat.env({
    browser: true,
    es2020: true,
    node: true
  }),

  ...compat.plugins( "react"),

  ...compat.config({
    plugins: ["@typescript-eslint", "react"],
    env: {
      browser: true,
      es2020: true,
      node: true
    },
    rules: {
      semi: "error",
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off"
    }
  })
];