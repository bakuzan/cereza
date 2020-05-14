import { DirectoryEntry } from './DirectoryEntry';

export interface CRZContext {
  isFile(location: string): Promise<boolean>;
  readDirectory(location: string): Promise<Array<DirectoryEntry>>;
}
