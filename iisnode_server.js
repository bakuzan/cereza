/* eslint-disable @typescript-eslint/no-var-requires */
const execa = require('execa');

async function init() {
  await execa('npm run apollo:start').catch(() =>
    console.log('CRZ: npm run apollo:start, Server failure.')
  );
}

init();
