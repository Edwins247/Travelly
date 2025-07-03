module.exports = {
  root: true,
  extends: [
    'next',
    'plugin:@typescript-eslint/recommended',
    'plugin:storybook/recommended',
    'plugin:prettier/recommended'   // ★ 추가
  ],
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    'prettier/prettier': ['error'],
  },
};
