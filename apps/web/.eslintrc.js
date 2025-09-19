module.exports = {
  extends: ['@community-app/eslint-config'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json']
  }
};
