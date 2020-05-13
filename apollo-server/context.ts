import { CRZContext } from '@i/CRZContext';
import readDirectory from './context/readDirectory';

export default ({ req, connection }): CRZContext => ({ readDirectory });
