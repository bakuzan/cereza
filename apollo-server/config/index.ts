import path from 'path';
import Umzug from 'umzug';
import { Sequelize } from 'sequelize';

function logUmzugEvent(eventName: string) {
  return function(name: string) {
    console.log(`${name} ${eventName}`);
  };
}

function createMigrationContext(sequelize: Sequelize) {
  const umzug = new Umzug({
    storage: 'sequelize',
    storageOptions: {
      sequelize
    },

    // see: https://github.com/sequelize/umzug/issues/17
    migrations: {
      params: [
        sequelize.getQueryInterface(), // queryInterface
        sequelize.constructor, // DataTypes
        function() {
          throw new Error(
            'Migration tried to use old style "done" callback. Please upgrade to "umzug" and return a promise instead.'
          );
        }
      ],
      path: path.join(__dirname, '..', 'migrations'),
      pattern: /\.js$/
    },

    logging: function() {
      console.log.apply(null, arguments as any);
    }
  });

  umzug.on('migrating', logUmzugEvent('migrating'));
  umzug.on('migrated', logUmzugEvent('migrated'));
  umzug.on('reverting', logUmzugEvent('reverting'));
  umzug.on('reverted', logUmzugEvent('reverted'));

  return umzug;
}

async function cmdStatus(umzug: Umzug.Umzug) {
  let executed = await umzug.executed();
  let pending = await umzug.pending();

  executed = executed.map((m) =>
    Object.assign(m, 'name', path.basename(m.file, '.js'))
  );

  pending = pending.map((m) =>
    Object.assign(m, 'name', path.basename(m.file, '.js'))
  );

  const current = executed.length > 0 ? executed[0].file : '<NO_MIGRATIONS>';
  const status = {
    current: current,
    executed: executed.map((m) => m.file),
    pending: pending.map((m) => m.file)
  };

  console.log(JSON.stringify(status, null, 2));
  return { executed, pending };
}

export default async function cmdMigrate(sequelize: Sequelize) {
  const umzug = createMigrationContext(sequelize);

  try {
    await umzug.up();
    const doneStr = `Migration DONE`;
    console.log(doneStr);
    console.log('='.repeat(doneStr.length));
  } catch (err) {
    const errorStr = `Migration ERROR`;
    console.log(errorStr);
    console.log('='.repeat(errorStr.length));
    console.log(err);
    console.log('='.repeat(errorStr.length));
    await umzug.down();
  }
  return await cmdStatus(umzug);
}
