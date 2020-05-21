import path from 'path';

export const castStringToBool = (val: string | undefined) =>
  val === 'true' ? true : val === 'false' ? false : !!val;

export const pathToFolderName = (str: string) => str.split('\\').pop() || '';

export const getPathExtension = (filePath: string) =>
  path
    .extname(filePath)
    .slice(1)
    .toLowerCase();
