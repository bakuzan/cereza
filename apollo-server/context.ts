import { CRZContext } from '@i/CRZContext';
import isFile from './context/isFile';
import readDirectory from './context/readDirectory';

export default ({ req, connection }): CRZContext => ({ isFile, readDirectory });
