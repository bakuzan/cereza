import { CRZContext } from './interfaces/CRZContext';
import readDirectory from './context/readDirectory';

export default ({ req, connection }): CRZContext => ({ readDirectory });
