// Learn more https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Tests live in src/__tests__/ today, but defend against future test files
// landing inside src/app/ — Expo Router's require.context would otherwise
// pull them (and @testing-library/react-native) into the device bundle.
config.resolver.blockList = [
  /.*\.test\.[jt]sx?$/,
  /.*\.spec\.[jt]sx?$/,
  /.*[\\/]__tests__[\\/].*/,
  /.*[\\/]__mocks__[\\/].*/,
];

module.exports = config;
