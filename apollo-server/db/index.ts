import path from 'path';
import { Sequelize } from 'sequelize-typescript';

import migrate from '#/config';
import { appName } from '#/constants';
import { castStringToBool } from '#/utils';

const db = new Sequelize(appName, '', undefined, {
  dialect: 'sqlite',
  storage: `${process.env.DB_STORAGE_PATH}${appName}.${process.env.NODE_ENV}.sqlite`,
  models: [path.resolve(__dirname, './*.model.ts')]
});

// Sync and Migrate db
const FORCE_DB_REBUILD = castStringToBool(process.env.FORCE_DB_REBUILD);

db.sync({ force: FORCE_DB_REBUILD }).then(() => migrate(db));

export { db };
