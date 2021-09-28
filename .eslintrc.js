module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  extends: ["plugin:prettier/recommended", "eslint:recommended"],
  parserOptions: {
    ecmaVersion: 8,
    parser: "babel-eslint",
    sourceType: "module",
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
    },
  },
  rules: {
    "no-console": 0,
  },
};
