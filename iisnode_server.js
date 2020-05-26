/* eslint-disable @typescript-eslint/no-var-requires */
const execa = require('execa');

async function init() {
  await execa('vue-cli-service apollo:start');
}

init();
