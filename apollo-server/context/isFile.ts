import fs from 'fs';
import { promisify } from 'util';

const lstat = promisify(fs.lstat);

export default async function isFile(location: string) {
  try {
    const stats = await lstat(location);
    return stats.isFile();
  } catch {
    return false;
  }
}
