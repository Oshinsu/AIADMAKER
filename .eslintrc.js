module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    'prefer-const': 'warn',
    'no-var': 'warn',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'react/no-unescaped-entities': 'off',
    'no-undef': 'off',
    '@next/next/no-img-element': 'off',
    'jsx-a11y/alt-text': 'off',
  },
  env: {
    node: true,
    es2022: true,
    browser: true,
  },
  ignorePatterns: [
    'node_modules/',
    'dist/',
    'build/',
    '.next/',
    '*.config.js',
  ],
}
