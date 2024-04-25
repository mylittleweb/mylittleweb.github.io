import globals from "globals";
import pluginJs from "@eslint/js";
import stylistic from "@stylistic/eslint-plugin-ts";
import stylisticTs from "@stylistic/eslint-plugin-ts";
import tseslint from "typescript-eslint";


/** @type {import('eslint').Linter.Config[]} */
export default [
  {files: ["**/*.{js,mjs,cjs,ts}"]},
  {languageOptions: {globals: globals.browser}},
  pluginJs.configs.recommended,
  stylistic.configs.all,
  ...tseslint.configs.recommended,
  {
    plugins: {
      "@stylistic/ts": stylisticTs
    },
    rules: {
      "@stylistic/ts/indent": ["error", 2],
      "@stylistic/ts/space-before-function-paren": ["error", "never"],
      "@stylistic/ts/quote-props": ["error", "as-needed"],
      "@stylistic/ts/no-extra-parens": "off",
      "@stylistic/ts/object-property-newline": "off",
      "@stylistic/ts/lines-between-class-members": "off",
      "@stylistic/ts/block-spacing": "off",

      "@typescript-eslint/no-explicit-any": "warn"
    }
  }
];
