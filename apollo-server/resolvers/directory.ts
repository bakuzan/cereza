import path from 'path';
import child from 'child_process';
import { promisify } from 'util';

import { CRZContext } from '@i/CRZContext';
import { DirectoryArgs } from '@i/DirectoryArgs';

const execProcess = promisify(child.exec);

export default {
  Query: {
    directory: async (_: any, args: DirectoryArgs, context: CRZContext) => {
      const entries = await context.readDirectory(args.path);

      return {
        canGallery: entries.every((x) => x.isImage),
        entries: entries.sort((a, b) =>
          a.isDirectory !== b.isDirectory
            ? b.isDirectory
              ? 1
              : -1
            : a.name.localeCompare(b.name)
        )
      };
    },
    fileAction: async (_: any, args: DirectoryArgs, context: CRZContext) => {
      const success = await context.isFile(args.path);

      if (success) {
        await execProcess(`start "" ${args.path}`);
      }

      return {
        success,
        errorMessages: success
          ? []
          : [
              'Path either does not exist, or is not a file. Path must point to a file.'
            ]
      };
    }
  }
};
