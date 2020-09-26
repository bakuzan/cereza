import path from 'path';
import { CRZVideo } from '@i/CRZVideo';
import { DirectoryEntry } from '@i/DirectoryEntry';

import { getPathExtension, filterToFiles, distinct } from '../utils';
import { obfuscate } from '../utils/obfuscate';

const base = process.env.VUE_APP_GRAPHQL_HTTP || '';
const getVideoUrl = (key: string) =>
  `${base.replace('/graphql', '')}/video?key=${key}`;

export default async function readVideos(
  entries: DirectoryEntry[],
  folderName: string
): Promise<CRZVideo[]> {
  const items = entries.filter(filterToFiles);
  const videos: CRZVideo[] = [];

  for (const entry of items) {
    const filePath = entry.targetPath ?? entry.path;
    const extension = getPathExtension(filePath);
    const key = obfuscate(filePath);
    const url = getVideoUrl(key);

    const fullName = entry.name;
    const folderName = path.basename(path.dirname(entry.path));
    const name = fullName
      .split('.')
      .slice(0, -1)
      .join('.');

    videos.push({
      key,
      name,
      folderName,
      fullName,
      extension,
      url
    });
  }

  return videos.filter(distinct((x) => x.url)).sort((a, b) => {
    const isATop = a.folderName === folderName;
    const isBTop = b.folderName === folderName;

    return isATop && !isBTop
      ? -1
      : !isATop && isBTop
      ? 1
      : a.folderName.localeCompare(b.folderName) ||
        a.name.localeCompare(b.name);
  });
}
