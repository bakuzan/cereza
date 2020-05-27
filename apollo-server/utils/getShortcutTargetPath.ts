import child from 'child_process';
import path from 'path';
import { promisify } from 'util';

const execProcess = promisify(child.exec);

function getCommand(lnkFile: string) {
  const normalizedFile = path.normalize(path.resolve(lnkFile));
  const getCOM = `(New-Object -COM WScript.Shell)`;

  return `${getCOM}.CreateShortcut('${normalizedFile}').TargetPath;`;
}

export default async function getShortcutTargetPath(
  lnkFile: string | string[]
) {
  if (process.platform !== 'win32') {
    return {
      success: false,
      items: [],
      errorMessages: ['Platform is not Windows']
    };
  }

  if (!Array.isArray(lnkFile) && !(typeof lnkFile === 'string')) {
    return {
      success: false,
      items: [],
      errorMessages: [
        `Input type is ${typeof lnkFile}. Input must be string or string array.`
      ]
    };
  }

  const lnkFiles = typeof lnkFile === 'string' ? [lnkFile] : lnkFile;
  const commands = lnkFiles.map((lnk) => getCommand(lnk));

  const { stdout, stderr } = await execProcess(
    `powershell.exe -command "${commands.join('')}"`
  );

  if (stderr) {
    return {
      success: false,
      items: [],
      errorMessages: [`Error running powershell command.`, stderr]
    };
  }

  const items = stdout
    .split('\r\n')
    .filter((v) => !!v)
    .map((targetPath, i) => ({
      path: lnkFiles[i],
      targetPath
    }));

  return {
    success: true,
    items,
    errorMessages: []
  };
}
