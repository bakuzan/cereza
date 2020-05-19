export default {
  Query: {
    hello: (root: any, { name }: { name: string }) =>
      `Hello ${name || 'World'}!`
  }
};
