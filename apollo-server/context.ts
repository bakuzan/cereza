import { CRZContext } from '@i/CRZContext';

import canGallery from './context/canGallery';
import canReel from './context/canReel';
import isFile from './context/isFile';
import pathExists from './context/pathExists';
import readDirectory from './context/readDirectory';
import readImages from './context/readImages';
import readReel from './context/readReel';
import { Pinned } from './context/dbContext';

export default (): CRZContext => ({
  canGallery,
  canReel,
  isFile,
  pathExists,
  readDirectory,
  readImages,
  readReel,
  Pinned
});
