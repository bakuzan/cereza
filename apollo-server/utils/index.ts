import path from 'path';

import { DirectoryEntry } from '@i/DirectoryEntry';
import { sysFiles } from '../constants';

export const castStringToBool = (val: string | undefined) =>
  val === 'true' ? true : val === 'false' ? false : !!val;

export const pathToFolderName = (str: string) => str.split('\\').pop() || '';

export const getPathExtension = (filePath: string) =>
  path
    .extname(filePath)
    .slice(1)
    .toLowerCase();

export const filterToFiles = (x: DirectoryEntry) =>
  x.isFile && !sysFiles.includes(x.name);

export const distinct = <T>(picker: (x: T) => any) => (
  x: T,
  index: number,
  arr: T[]
) => arr.findIndex((y) => picker(x) === picker(y)) === index;
