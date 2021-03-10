import { Repository } from 'sequelize-typescript';
import Pinned from '../apollo-server/db/Pinned.model';

import { CRZImage } from './CRZImage';
import { CRZMedia } from './CRZMedia';
import { DirectoryEntry } from './DirectoryEntry';
import { SortOptions } from './SortOptions';

export interface CRZContext {
  canGallery(entries: DirectoryEntry[]): Promise<boolean>;
  canReel(entries: DirectoryEntry[]): Promise<boolean>;
  isFile(location: string): Promise<boolean>;
  pathExists(location: string): Promise<boolean>;
  readDirectory(
    location: string,
    isRecursive: boolean
  ): Promise<Array<DirectoryEntry>>;
  readImages(
    entries: DirectoryEntry[],
    start: number,
    end: number
  ): Promise<Array<CRZImage>>;
  readReel(
    entries: DirectoryEntry[],
    folderName: string,
    sorting: SortOptions
  ): Promise<Array<CRZMedia>>;
  Pinned: Repository<Pinned>;
}
