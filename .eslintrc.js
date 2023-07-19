module.exports = {
  extends: 'eslint:recommended',
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 'latest',
    requireConfigFile: false,
  },
  env: {
    es6: true,
    browser: true,
    node: true,
  },
  ignorePatterns: ['node_modules', 'template'],
  rules: {
    'no-unused-vars': 'error',
  },
};
