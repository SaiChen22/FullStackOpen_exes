import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";
import stylisticJs from '@stylistic/eslint-plugin'

export default defineConfig([
  { files: ["**/*.{js,mjs,cjs,jsx}"],
     plugins: { js,
      '@stylistic/js' : stylisticJs
      },rules: { 
      '@stylistic/js/indent': ['error', 4],
      '@stylistic/js/linebreak-style': ['error', 'unix'],
      '@stylistic/js/quotes': ['error', 'single'],
      '@stylistic/js/semi': ['error', 'never'],
    },  extends: ["js/recommended"], 
     languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  pluginReact.configs.flat.recommended,
]);
