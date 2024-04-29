import { FlatCompat } from "@eslint/eslintrc";
import path from "path";
import { fileURLToPath } from "url";

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


  ...compat.config({
    parserOptions: {
      "ecmaVersion": 2018,
      sourceType: "module"
    },
    env: {
      browser: true,
      es2020: true,
      node: true
    }
  })
];