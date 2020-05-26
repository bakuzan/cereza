/* eslint-disable @typescript-eslint/no-var-requires */
const execa = require('execa');

async function init() {
  await execa('vue-cli-service apollo:start').catch(() =>
    console.log('CRZ: vue-cli-service apollo:start, Server failure.')
  );
}

init();
