import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: /^react-native\/Libraries\/Utilities\/codegenNativeComponent/,
        replacement: path.resolve(__dirname, './src/shims/codegenNativeComponent.js'),
      },
      {
        find: /^react-native\/Libraries\/ReactNative\/AppContainer/,
        replacement: path.resolve(__dirname, './src/shims/AppContainer.js'),
      },
      {
        find: /^react-native$/,
        replacement: path.resolve(__dirname, './src/shims/reactNativeWeb.js'),
      },
      {
        find: '@react-native/assets-registry/registry',
        replacement: path.resolve(__dirname, './src/shims/assetsRegistry.js'),
      },
      {
        find: '@react-native/assets-registry',
        replacement: path.resolve(__dirname, './src/shims/assetsRegistry.js'),
      },
      {
        find: '@',
        replacement: path.resolve(__dirname, './src'),
      },
    ],
    extensions: [
      '.web.tsx',
      '.web.ts',
      '.web.jsx',
      '.web.js',
      '.tsx',
      '.ts',
      '.jsx',
      '.js',
    ],
  },
  define: {
    global: 'window',
    __DEV__: JSON.stringify(true),
  },
  server: {
    port: 3000,
    open: true,
  },
});
