import child from 'child_process';
import { promisify } from 'util';

import { DirectoryArgs } from '@i/DirectoryArgs';
import createResolver from '#/utils/createResolver';
import { ConfirmationResponse } from '@i/ConfirmationResponse';

const execProcess = promisify(child.exec);

export default createResolver({
  Query: {
    async directory(_, args: DirectoryArgs, context) {
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
    async fileAction(
      _,
      args: DirectoryArgs,
      context
    ): Promise<ConfirmationResponse> {
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
            ],
        messages: []
      };
    }
  }
});
