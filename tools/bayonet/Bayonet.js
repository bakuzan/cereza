const child = require('child_process');
const fs = require('fs');
const path = require('path');

const targetPathFile = path.resolve(
  __dirname,
  '../../',
  './server/apollo-server/resolvers/targetPath.txt'
);

function run() {
  fs.watchFile(
    targetPathFile,
    {
      interval: 250,
      persistent: true
    },
    function onFileChange() {
      const file = fs.readFileSync(targetPathFile, 'utf8');
      const targetPath = file.toString().split('\r\n')[0];

      const cmdArgs = ['/s', '/c', 'start', '""', '/b', `"${targetPath}"`];

      const cmdOpts = {
        detached: true,
        stdio: 'ignore',
        windowsVerbatimArguments: true
      };

      child.spawn('cmd.exe', cmdArgs, cmdOpts).unref();

      fs.writeFileSync(__dirname + '/lastTargetPath.txt', targetPath);
    }
  );
}

run();
