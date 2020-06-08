import fs from 'fs';
import { promisify } from 'util';

import { CRZImage } from '@i/CRZImage';
import { DirectoryEntry } from '@i/DirectoryEntry';
import { getPathExtension, filterToFiles } from '../utils';

const readFile = promisify(fs.readFile);

export default async function readImages(
  entries: DirectoryEntry[],
  start: number,
  end: number
): Promise<CRZImage[]> {
  const items = entries.filter(filterToFiles).slice(start, end);
  const images: CRZImage[] = [];

  for (let i = 0; i < items.length; i++) {
    const entry = items[i];
    const filePath = entry.targetPath ?? entry.path;
    const buff = await readFile(filePath);

    const ext = getPathExtension(filePath);
    const image = Buffer.from(buff).toString('base64');

    images.push({
      image: `data:image/${ext};base64,${image}`,
      pageNumber: start + i + 1, // begin at page 1
      url: entry.path
    });
  }

  return images;
}
