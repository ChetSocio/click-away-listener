export const preset = "ts-jest";
export const testEnvironment = "jsdom";
export const setupFilesAfterEnv = ["@testing-library/jest-dom/extend-expect"];
export const moduleNameMapper = {
  "^@/(.*)$": "<rootDir>/src/$1",
};
