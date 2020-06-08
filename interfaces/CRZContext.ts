import { Repository } from 'sequelize-typescript';
import Pinned from '../apollo-server/db/Pinned.model';

import { CRZImage } from './CRZImage';
import { CRZVideo } from './CRZVideo';
import { DirectoryEntry } from './DirectoryEntry';

export interface CRZContext {
  canGallery(entries: DirectoryEntry[]): Promise<boolean>;
  canReel(entries: DirectoryEntry[]): Promise<boolean>;
  isFile(location: string): Promise<boolean>;
  pathExists(location: string): Promise<boolean>;
  readDirectory(location: string): Promise<Array<DirectoryEntry>>;
  readImages(
    entries: DirectoryEntry[],
    start: number,
    end: number
  ): Promise<Array<CRZImage>>;
  readVideos(entries: DirectoryEntry[]): Promise<Array<CRZVideo>>;
  Pinned: Repository<Pinned>;
}
