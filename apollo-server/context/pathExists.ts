import fs from 'fs';
import { promisify } from 'util';

const lstat = promisify(fs.lstat);

export default async function pathExists(location: string) {
  try {
    return await lstat(location).then(() => true);
  } catch {
    return false;
  }
}
