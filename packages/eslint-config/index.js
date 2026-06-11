/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ["eslint:recommended"],
  env: { node: true, es2021: true },
  parserOptions: { ecmaVersion: "latest", sourceType: "module" },
};
