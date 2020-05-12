import GraphQLJSON from 'graphql-type-json';

export default {
  JSON: GraphQLJSON,
  Query: {
    hello: (root: any, { name }: { name: string }) =>
      `Hello ${name || 'World'}!`
  }
};
