import * as RNWeb from 'react-native-web';

// Re-export everything from react-native-web
export * from 'react-native-web';

// Mock React Native Fabric / TurboModule exports needed for web
export const codegenNativeComponent = (name) => name;
export const codegenNativeCommands = () => ({});
export const TurboModuleRegistry = {
  get: () => null,
  getEnforcing: () => ({}),
};

export default {
  ...RNWeb,
  codegenNativeComponent,
  codegenNativeCommands,
  TurboModuleRegistry,
};
