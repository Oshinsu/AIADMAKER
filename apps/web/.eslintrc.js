module.exports = {
  extends: [
    'next/core-web-vitals',
  ],
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
}
