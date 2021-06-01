import path from 'path';
import { CRZMedia } from '@i/CRZMedia';
import { DirectoryEntry } from '@i/DirectoryEntry';

import { getPathExtension, filterToFiles, distinct } from '../utils';
import { obfuscate } from '../utils/obfuscate';
import { SortOptions } from '@i/SortOptions';

const base = process.env.VUE_APP_GRAPHQL_HTTP || '';
const getVideoUrl = (key: string) =>
  `${base.replace('/graphql', '')}/stream?key=${key}`;

export default async function readReel(
  entries: DirectoryEntry[],
  folderName: string,
  sorting: SortOptions
): Promise<CRZMedia[]> {
  const items = entries.filter(filterToFiles);
  const media: CRZMedia[] = [];

  for (const entry of items) {
    const filePath = entry.targetPath ?? entry.path;
    const extension = getPathExtension(filePath);
    const key = obfuscate(filePath);
    const url = getVideoUrl(key);

    const date = entry.date;
    const fullName = entry.name;
    const folderPath = path.dirname(entry.path);
    const folderName = path.basename(folderPath);
    const name = fullName
      .split('.')
      .slice(0, -1)
      .join('.');

    media.push({
      key,
      name,
      date,
      folderName,
      folderPath,
      fullName,
      extension,
      url
    });
  }

  const isTitle = sorting.field === 'Name';
  const isDesc = sorting.order === 'DESC';
  return media.filter(distinct((x) => x.url)).sort((a, b) => {
    if (!isTitle) {
      return isDesc ? (b.date < a.date ? -1 : 1) : b.date < a.date ? 1 : -1;
    }

    const isATop = a.folderName === folderName;
    const isBTop = b.folderName === folderName;

    if (isATop && !isBTop) return -1;
    if (!isATop && isBTop) return 1;

    return isDesc
      ? b.folderName.localeCompare(a.folderName) || b.name.localeCompare(a.name)
      : a.folderName.localeCompare(b.folderName) ||
          a.name.localeCompare(b.name);
  });
}
