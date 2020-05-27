import { DirectoryEntry } from '@i/DirectoryEntry';
import { filterToFiles } from '../utils';

export default async function canGallery(items: DirectoryEntry[]) {
  const files = items.filter(filterToFiles);
  return files.length > 1 && files.every((x) => x.isImage);
}
