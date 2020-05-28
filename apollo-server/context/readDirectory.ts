import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

import { DirectoryEntry } from '@i/DirectoryEntry';
import {
  isImage,
  isShortcut,
  isVideo,
  isFile,
  isDirectory
} from './checkFileType';
import getShortcutTargetPath from '@s/utils/getShortcutTargetPath';

const readdir = promisify(fs.readdir);

export default async function readDirectory(
  directoryPath: string
): Promise<DirectoryEntry[]> {
  let systemPath = path.resolve(path.join(directoryPath, '\\'));

  if (isShortcut(systemPath)) {
    const result = await getShortcutTargetPath([systemPath]);

    if (result.success) {
      systemPath = result.items.pop()?.targetPath ?? systemPath;
    }
  }

  const items = await readdir(systemPath, {
    encoding: 'utf-8',
    withFileTypes: true
  });

  let entries: DirectoryEntry[] = items.map((x) => {
    const fullName = path.join(systemPath, x.name);
    const parentName = path.basename(path.dirname(fullName));

    return {
      name: x.name,
      path: fullName,
      targetPath: null,
      parentName,
      isDirectory: x.isDirectory(),
      isFile: x.isFile(),
      isImage: isImage(x.name),
      isVideo: isVideo(x.name),
      isShortcut: isShortcut(x.name)
    };
  });

  const shortcuts = entries.filter((x) => x.isShortcut);

  if (shortcuts.length) {
    const paths = shortcuts.map((x) => x.path);
    const result = await getShortcutTargetPath(paths);

    if (result.success) {
      entries = entries.map((x) => {
        const targetPath =
          result.items.find((p) => p.path === x.path)?.targetPath ?? null;

        return {
          ...x,
          isDirectory: targetPath ? isDirectory(targetPath) : x.isDirectory,
          isFile: targetPath ? isFile(targetPath) : x.isFile,
          isImage: targetPath ? isImage(targetPath) : x.isImage,
          isVideo: targetPath ? isVideo(targetPath) : x.isVideo,
          targetPath
        };
      });
    }
  }

  return entries;
}
