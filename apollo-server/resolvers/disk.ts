import path from 'path';
import child from 'child_process';
import { promisify } from 'util';

import { Disk } from '@i/Disk';
import createResolver from '@s/utils/createResolver';

const execProcess = promisify(child.exec);

export default createResolver({
  Query: {
    async disks(): Promise<Disk[]> {
      const result = await execProcess('wmic logicaldisk get name');

      return result.stdout
        .split('\r\r\n')
        .filter((value) => /[A-Za-z]:/.test(value))
        .map((value) => {
          const name = value.trim();

          return {
            name,
            path: path.join(name, '.')
          };
        });
    }
  }
});
