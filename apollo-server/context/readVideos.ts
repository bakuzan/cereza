import { CRZVideo } from '@i/CRZVideo';
import { DirectoryEntry } from '@i/DirectoryEntry';

import { getPathExtension } from '../utils';
import { obfuscate } from '../utils/obfuscate';

const base = process.env.VUE_APP_GRAPHQL_HTTP || '';
const getVideoUrl = (url: string) =>
  `${base.replace('/graphql', '')}/video/${obfuscate(url)}`;

export default async function readImages(
  entries: DirectoryEntry[]
): Promise<CRZVideo[]> {
  const videos: CRZVideo[] = [];

  for (const entry of entries) {
    const extension = getPathExtension(entry.path);
    const url = getVideoUrl(entry.path);
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

  return videos;
}