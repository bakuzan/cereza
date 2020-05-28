const cpy = require('cpy');

async function copyIt() {
  await cpy(
    ['apollo-server/**/*.graphql', 'apollo-server/**/.gitkeep'],
    'server/',
    {
      dot: true,
      parents: true
    }
  );
}

copyIt()
  .then(() => console.log('Done'))
  .catch((err) => console.log('Failed', err));
