import { CRZVideo } from '@i/CRZVideo';
import { DirectoryEntry } from '@i/DirectoryEntry';

import { getPathExtension, filterToFiles } from '../utils';
import { obfuscate } from '../utils/obfuscate';

const base = process.env.VUE_APP_GRAPHQL_HTTP || '';
const getVideoUrl = (url: string) =>
  `${base.replace('/graphql', '')}/video/${obfuscate(url)}`;

export default async function readVideos(
  entries: DirectoryEntry[]
): Promise<CRZVideo[]> {
  const items = entries.filter(filterToFiles);
  const videos: CRZVideo[] = [];

  for (const entry of items) {
    const filePath = entry.targetPath ?? entry.path;
    const extension = getPathExtension(filePath);
    const url = getVideoUrl(filePath);

    const fullName = entry.name;
    const name = fullName
      .split('.')
      .slice(0, -1)
      .join('.');

    videos.push({
      name,
      fullName,
      extension,
      url
    });
  }

  return videos.sort((a, b) => a.name.localeCompare(b.name));
}
