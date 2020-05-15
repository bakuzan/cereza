import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

import { DirectoryEntry } from '@i/DirectoryEntry';
import { isImage, isVideo } from './checkFileType';

const readdir = promisify(fs.readdir);

export default async function readDirectory(
  directoryPath: string
): Promise<DirectoryEntry[]> {
  const systemPath = path.resolve(path.join(directoryPath, '\\'));

  const items = await readdir(systemPath, {
    encoding: 'utf-8',
    withFileTypes: true
  });

  return items.map((x) => {
    const fullName = path.join(directoryPath, x.name);
    const parentName = path.basename(path.dirname(fullName));

    return {
      name: x.name,
      path: fullName,
      parentName,
      isDirectory: x.isDirectory(),
      isFile: x.isFile(),
      isImage: isImage(x.name),
      isVideo: isVideo(x.name)
    };
  });
}
