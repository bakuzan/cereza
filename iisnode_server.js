const dotenv = require('dotenv');
const server = require('vue-cli-plugin-apollo/graphql-server');

dotenv.config();

const opts = {
  host: 'localhost',
  port: process.env.PORT,
  graphqlPath: '/graphql',
  subscriptionsPath: '/graphql',
  enableMocks: false,
  enableEngine: false,
  typescript: true,
  cors: '*',
  timeout: 1000000,
  quiet: false,
  paths: {
    typeDefs: require.resolve('./apollo-server/type-defs.ts'),
    resolvers: require.resolve('./apollo-server/resolvers.ts'),
    context: require.resolve('./apollo-server/context.ts'),
    server: require.resolve('./apollo-server/server.ts'),
    directives: require.resolve('./apollo-server/directives.ts')
  }
};

server(opts, () => console.log('Cereza Server is running!'));
