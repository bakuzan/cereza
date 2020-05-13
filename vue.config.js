/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');

module.exports = {
  pluginOptions: {
    apollo: {
      cors: '*',
      enableMocks: false,
      typescript: true,
      lintGQL: true
    }
  },
  chainWebpack: (config) => {
    config.resolve.alias.set('@i', path.resolve(__dirname, 'interfaces'));
  }
};
