module.exports = {
  extends: [
    "next",
    "prettier",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
  ],
  settings: {
    next: {
      rootDir: ["apps/*/", "packages/*/"],
    },
  },
  rules: {
    "@next/next/no-html-link-for-pages": "off",
    "react/jsx-key": "off",
  },
};
