import { DirectoryEntry } from './DirectoryEntry';

export interface CRZContext {
  readDirectory(path: string): Promise<Array<DirectoryEntry>>;
}
