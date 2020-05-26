/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');

module.exports = {
  pluginOptions: {
    apollo: {
      cors: '*',
      enableMocks: false,
      typescript: true,
      lintGQL: true,
      serverOptions: {
        introspection: true,
        playground: {
          settings: {
            'editor.cursorShape': 'block',
            'editor.fontSize': 16,
            'editor.fontFamily': '"Lucida Console", Consolas, monospace',
            'editor.theme': 'light'
          }
        }
      }
    }
  },
  chainWebpack: (config) => {
    config.resolve.alias.set('@i', path.resolve(__dirname, 'interfaces'));
    config.resolve.alias.set('#', path.resolve(__dirname, 'apollo-server'));
  }
};
