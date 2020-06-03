import fs from 'fs';
import { promisify } from 'util';

import { CRZImage } from '@i/CRZImage';
import { DirectoryEntry } from '@i/DirectoryEntry';
import { getPathExtension, filterToFiles } from '../utils';

const readFile = promisify(fs.readFile);

export default async function readImages(
  entries: DirectoryEntry[]
): Promise<CRZImage[]> {
  const items = entries.filter(filterToFiles);
  const images: CRZImage[] = [];

  for (const entry of items) {
    const filePath = entry.targetPath ?? entry.path;
    const buff = await readFile(filePath);

    const ext = getPathExtension(filePath);
    const image = Buffer.from(buff).toString('base64');

    images.push({
      image: `data:image/${ext};base64,${image}`,
      url: entry.path
    });
  }

  return images;
}
