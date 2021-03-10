import { DirectoryEntry } from '@i/DirectoryEntry';
import { filterToFiles } from '../utils';

export default async function canReel(items: DirectoryEntry[]) {
  const files = items.filter(filterToFiles);
  return (
    files.length > 0 &&
    (files.every((x) => x.isVideo) || files.every((x) => x.isAudio))
  );
}
