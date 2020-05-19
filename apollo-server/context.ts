import { CRZContext } from '@i/CRZContext';

import isFile from './context/isFile';
import readDirectory from './context/readDirectory';
import { Pinned } from './context/dbContext';

export default (): CRZContext => ({
  isFile,
  readDirectory,
  Pinned
});
