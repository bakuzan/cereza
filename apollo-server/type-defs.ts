import path from 'path';
import { fileLoader, mergeTypes } from 'merge-graphql-schemas';
import { writeFileSync } from 'fs';

const typeDefs = fileLoader(path.join(__dirname, './type-defs'));

const combined = mergeTypes(typeDefs, {
  all: true
});

// writeFileSync(path.join(__dirname, 'schema.graphql'), combined);

export default combined;
