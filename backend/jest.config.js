module.exports = {
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.test.js"],
  collectCoverageFrom: [
    "src/**/*.js",
    "!src/index.js",
    "!src/config/swagger.js",
  ],
  setupFilesAfterEnv: ["<rootDir>/__tests__/setup.js"],
  modulePathIgnorePatterns: ["<rootDir>/node_modules/"],
};
