import path from 'path';
import { fileLoader, mergeTypes } from 'merge-graphql-schemas';
import { writeFileSync } from 'fs';

const typeDefs = fileLoader(path.join(__dirname, './type-defs'));

const combined = mergeTypes(typeDefs, {
  all: true
});

// Required in dev to create/update schema.graphql
if (process.env.NODE_ENV === 'development') {
  writeFileSync(
    path.join(__dirname, '../node_modules/.temp/graphql', 'schema.graphql'),
    combined
  );
}

export default combined;
