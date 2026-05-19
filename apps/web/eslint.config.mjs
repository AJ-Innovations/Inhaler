import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import sonarjs from "eslint-plugin-sonarjs";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  sonarjs.configs.recommended,
  {
    plugins: {
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "react/no-unescaped-entities": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      "sonarjs/no-nested-conditional": "warn",
      "sonarjs/no-ignored-exceptions": "warn",
      "prefer-const": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "@next/next/no-img-element": "warn",
      "sonarjs/unused-import": "warn",
      "sonarjs/no-duplicated-branches": "warn",
      "sonarjs/pseudo-random": "off",
      "sonarjs/cognitive-complexity": "warn",
      "sonarjs/no-commented-code": "warn",
      "sonarjs/no-unused-vars": "warn",
      "sonarjs/no-dead-store": "warn",
      "sonarjs/no-redundant-assignments": "warn",
      "@typescript-eslint/no-use-before-define": "warn"
    }
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
