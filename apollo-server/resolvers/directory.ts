import { CRZContext } from '@i/CRZContext';
import { DirectoryArgs } from '@i/DirectoryArgs';

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
    }
  }
};
