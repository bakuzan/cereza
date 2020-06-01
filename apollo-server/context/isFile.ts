import fs from 'fs';
import { promisify } from 'util';

const lstat = promisify(fs.lstat);

export default async function isFile(location: string) {
  try {
    return await lstat(location).then((stats) => stats.isFile());
  } catch {
    return false;
  }
}
