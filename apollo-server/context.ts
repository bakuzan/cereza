import { CRZContext } from '@i/CRZContext';

import canGallery from './context/canGallery';
import canReel from './context/canReel';
import pathExists from './context/pathExists';
import readDirectory from './context/readDirectory';
import readImages from './context/readImages';
import readVideos from './context/readVideos';
import { Pinned } from './context/dbContext';

export default (): CRZContext => ({
  canGallery,
  canReel,
  pathExists,
  readDirectory,
  readImages,
  readVideos,
  Pinned
});
