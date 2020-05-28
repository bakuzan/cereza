import child from 'child_process';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const execProcess = promisify(child.exec);
const unlinkAsync = promisify(fs.unlink);
const writeFileAsync = promisify(fs.writeFile);

const tempFile = path.resolve(__dirname, './file.txt');

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
  const normalizedPath = lnkFiles
    .map((lnk) => path.normalize(path.resolve(lnk)))
    .join('\r\n');

  // Put shortcuts args in file
  await writeFileAsync(tempFile, normalizedPath);

  // Read file and loop
  const getTargetPath = `(New-Object -COM WScript.Shell).CreateShortcut($line).TargetPath;`;
  const loopPaths = `foreach($line in Get-Content ${tempFile}) {${getTargetPath}}`;
  const { stdout, stderr } = await execProcess(
    `powershell.exe -command ${loopPaths}`
  );

  // Remove file
  await unlinkAsync(tempFile);

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
