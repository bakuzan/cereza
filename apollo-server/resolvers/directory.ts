import { CRZContext } from '../interfaces/CRZContext';
import { DirectoryArgs } from '../interfaces/DirectoryArgs';

export default {
  Query: {
    directory: async (_: any, args: DirectoryArgs, context: CRZContext) => {
      const entries = await context.readDirectory(args.path);

      return {
        entries,
        canGallery: entries.every((x) => x.isImage)
      };
    }
  }
};
