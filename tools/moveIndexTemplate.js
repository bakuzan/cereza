const fs = require('fs');
const { promisify } = require('util');

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

const source = './dist/index.html';
const target = './public/index.html';

async function moveIt() {
  const file = await readFileAsync(source);
  await writeFileAsync(target, file);
}

moveIt()
  .then(() => console.log('Done'))
  .catch((err) => console.log('Failed', err));
