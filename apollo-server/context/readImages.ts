import fs from 'fs';
import { promisify } from 'util';

import { DirectoryEntry } from '@i/DirectoryEntry';
import { getPathExtension, filterToFiles } from '../utils';

const readFile = promisify(fs.readFile);

export default async function readImages(
  entries: DirectoryEntry[]
): Promise<string[]> {
  const items = entries.filter(filterToFiles);
  const images: string[] = [];

  for (const entry of items) {
    const buff = await readFile(entry.path);

    const ext = getPathExtension(entry.path);
    const image = Buffer.from(buff).toString('base64');

    images.push(`data:image/${ext};base64,${image}`);
  }

  return images;
}
