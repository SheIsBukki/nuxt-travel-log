import antfu from "@antfu/eslint-config";

import withNuxt from "./.nuxt/eslint.config.mjs";

// TODO: add tailwindcss plugin for auto-sorting class names

export default withNuxt(
  // Your custom configs here
  antfu({
    // Type of the project. 'lib' for libraries, the default is 'app'
    type: "app",

    // Enable stylistic formatting rules
    // stylistic: true,

    // Or customize the stylistic rules
    stylistic: {
      indent: 2, // 4, or 'tab'
      quotes: "double", // or 'double'
      semi: true, // I added this because it is in the tutorial
    },

    // TypeScript and Vue are autodetected, you can also explicitly enable them:
    typescript: true,
    vue: true,

    // I added formatters and rules according to the tutorial.
    formatters: true,
    rules: {
      "vue/max-attributes-per-line": [
        "error",
        {
          singleline: {
            max: 2,
          },
          multiline: {
            max: 1,
          },
        },
      ],
      "ts/no-redeclare": "off",
      "ts/consistent-type-definitions": ["error", "type"],
      "no-console": ["warn"],
      "antfu/no-top-level-await": ["off"],
      "node/prefer-global/process": ["off"],
      "node/no-process-env": ["error"],
      "perfectionist/sort-imports": [
        "error",
        {
          tsconfigRootDir: ".",
        },
      ],
      "unicorn/filename-case": [
        "error",
        {
          case: "kebabCase",
          ignore: ["README.md"],
        },
      ],
    },

    // Disable jsonc and yaml support
    jsonc: false, // This is not in the tutorial but is in the plugin code
    yaml: false, // This is not in the tutorial but is in the plugin code

    // `.eslintignore` is no longer supported in Flat config, use `ignores` instead
    ignores: [
      "**/fixtures", // This is not in the tutorial but is in the plugin code
      ".pnpm-store/**", // I added this because it is in the tutorial
      "**/migrations/*", // I added this because it is in the tutorial——it ignores the migrations folder
      // ...globs
    ],
  }),
);
