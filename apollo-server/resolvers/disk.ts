import child from 'child_process';
import path from 'path';
import { promisify } from 'util';

const execProcess = promisify(child.exec);

export default {
  Query: {
    async disks() {
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
};
