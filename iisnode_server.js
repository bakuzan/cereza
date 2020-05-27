const dotenv = require('dotenv');
const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');

dotenv.config();

const options = {
  port: process.env.PORT,
  graphqlPath: '/graphql',
  cors: '*',
  paths: {
    typeDefs: require.resolve('./server/apollo-server/type-defs.js'),
    resolvers: require.resolve('./server/apollo-server/resolvers.js'),
    context: require.resolve('./server/apollo-server/context.js'),
    server: require.resolve('./server/apollo-server/server.js'),
    directives: require.resolve('./server/apollo-server/directives.js')
  },
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
};

// Express app
const app = express();

// Customize those files
const typeDefs = load(options.paths.typeDefs);
const resolvers = load(options.paths.resolvers);
const context = load(options.paths.context);
const schemaDirectives = load(options.paths.directives);

// Customize server
try {
  const serverModule = load(options.paths.server);
  serverModule(app);
} catch (e) {
  // No file found
}

// Apollo Server
const server = new ApolloServer({
  typeDefs: processSchema(typeDefs),
  resolvers,
  schemaDirectives,
  dataSources: null,
  tracing: true,
  cacheControl: true,
  engine: true,
  context,
  ...options.serverOptions
});

// Express middleware
server.applyMiddleware({
  app,
  path: options.graphqlPath,
  cors: options.cors
});

// Start server
app.listen(options.port, () => {
  console.log(
    `Go to http://localhost:${options.port}${options.graphqlPath} to run queries!`
  );
});

// Helpers

function load(file) {
  const module = require(file);
  return module.default ? module.default : module;
}

function processSchema(typeDefs) {
  if (Array.isArray(typeDefs)) {
    return typeDefs.map(processSchema);
  }

  if (typeof typeDefs === 'string') {
    // Convert schema to AST
    typeDefs = gql(typeDefs);
  }

  // Remove upload scalar (it's already included in Apollo Server)
  removeFromSchema(typeDefs, 'ScalarTypeDefinition', 'Upload');

  return typeDefs;
}

function removeFromSchema(document, kind, name) {
  const definitions = document.definitions;
  const index = definitions.findIndex(
    (def) =>
      def.kind === kind && def.name.kind === 'Name' && def.name.value === name
  );

  if (index !== -1) {
    definitions.splice(index, 1);
  }
}
