import { Repository } from 'sequelize-typescript';
import Pinned from '../apollo-server/db/Pinned.model';

import { DirectoryEntry } from './DirectoryEntry';

export interface CRZContext {
  isFile(location: string): Promise<boolean>;
  readDirectory(location: string): Promise<Array<DirectoryEntry>>;
  Pinned: Repository<Pinned>;
}
