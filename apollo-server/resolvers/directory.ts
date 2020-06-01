import child from 'child_process';

import { DirectoryArgs } from '@i/DirectoryArgs';
import { ConfirmationResponse } from '@i/ConfirmationResponse';
import { CRZVideo } from '@i/CRZVideo';
import { pathToFolderName } from '@s/utils';
import createResolver from '@s/utils/createResolver';

export default createResolver({
  Query: {
    async directory(_, args: DirectoryArgs, context) {
      const entries = await context.readDirectory(args.path);

      return {
        canGallery: context.canGallery(entries),
        canReel: context.canReel(entries),
        entries: entries.sort((a, b) =>
          a.isDirectory !== b.isDirectory
            ? b.isDirectory
              ? 1
              : -1
            : a.name.localeCompare(b.name)
        )
      };
    },
    async gallery(_, args: DirectoryArgs, context) {
      const entries = await context.readDirectory(args.path);
      const canGallery = context.canGallery(entries);
      const folderName = pathToFolderName(args.path);
      let images: string[] = [];

      if (canGallery) {
        images = await context.readImages(entries);
      }

      return {
        canGallery,
        folderName,
        images
      };
    },
    async reel(_, args: DirectoryArgs, context) {
      const entries = await context.readDirectory(args.path);
      const canReel = context.canReel(entries);
      const folderName = pathToFolderName(args.path);
      let videos: CRZVideo[] = [];

      if (canReel) {
        videos = await context.readVideos(entries);
      }

      return {
        canReel,
        folderName,
        videos
      };
    },
    async action(
      _,
      args: DirectoryArgs,
      context
    ): Promise<ConfirmationResponse> {
      const success = await context.pathExists(args.path);

      if (!success) {
        return {
          success,
          errorMessages: ['Path does not exist.'],
          messages: []
        };
      }

      const cmdArgs = ['/s', '/c', 'start', '""', '/b', `"${args.path}"`];
      const cmdOpts: Partial<child.SpawnOptions> = {
        detached: true,
        env: process.env,
        stdio: 'ignore',
        windowsVerbatimArguments: true
      };

      child.spawn('cmd.exe', cmdArgs, cmdOpts).unref();

      return {
        success: true,
        errorMessages: [],
        messages: []
      };
    }
  }
});
