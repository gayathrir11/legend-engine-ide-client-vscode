// const ERROR = 2;

module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'prettier',
  ],
  // rules: {
  //   'prettier/prettier': ERROR,
  // },
};
