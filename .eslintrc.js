module.exports = {
  root: true,

  env: {
    es2021: true,
    browser: true,
    jest: true,
  },

  parserOptions: {
    project: './tsconfig.json',
    sourceType: "module",
  },

  plugins: ['@typescript-eslint', 'promise'],

  extends: [
    'airbnb-typescript',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:promise/recommended',
    'plugin:prettier/recommended',
  ],

  rules: {
    "prettier/prettier": "warn",
  },

  settings: {},
};
