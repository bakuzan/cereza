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

async function getDirectoryItems(location: string) {
  return await readdir(location, {
    encoding: 'utf-8',
    withFileTypes: true
  });
}

function processDirectory(
  systemPath: string,
  item: fs.Dirent,
  level = 0
): DirectoryEntry {
  const fullName = path.join(systemPath, item.name);
  const parentName = path.basename(path.dirname(fullName));
  const isDirectory = item.isDirectory();

  return {
    name: item.name,
    path: fullName,
    level,
    targetPath: null,
    parentName,
    isDirectory,
    isFile: item.isFile(),
    isImage: isImage(item.name),
    isVideo: isVideo(item.name),
    isShortcut: isShortcut(item.name)
  };
}

async function processShortcuts(items: DirectoryEntry[]) {
  let entries = [...items];
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

export default async function readDirectory(
  directoryPath: string,
  isRecursive: boolean
): Promise<DirectoryEntry[]> {
  let systemPath = path.resolve(path.join(directoryPath, '\\'));

  if (isShortcut(systemPath)) {
    const result = await getShortcutTargetPath([systemPath]);

    if (result.success) {
      systemPath = result.items.pop()?.targetPath ?? systemPath;
    }
  }

  const items = await getDirectoryItems(systemPath);
  const entries = await processShortcuts(
    items.map((x) => processDirectory(systemPath, x))
  );

  if (isRecursive) {
    for (const entry of entries) {
      if (entry.isDirectory) {
        const parentPath = entry.targetPath ?? entry.path;
        const level = entry.level + 1;

        const childItems = await getDirectoryItems(parentPath);
        const children = await processShortcuts(
          childItems.map((x) => processDirectory(parentPath, x, level))
        );

        entries.push(...children);
      }
    }
  }

  return entries;
}
