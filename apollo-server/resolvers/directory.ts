import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

import { DirectoryArgs } from '@i/DirectoryArgs';
import { ConfirmationResponse } from '@i/ConfirmationResponse';
import { CRZImage } from '@i/CRZImage';
import { CRZVideo } from '@i/CRZVideo';
import { PagedArgs } from '@i/PagedArgs';

import { pathToFolderName, filterToFiles } from '@s/utils';
import createResolver from '@s/utils/createResolver';

const writeFileAsync = promisify(fs.writeFile);

export default createResolver({
  Query: {
    async directory(_, args: DirectoryArgs, context) {
      const isRecursive = args.isRecursive ?? false;
      const entries = await context.readDirectory(args.path, isRecursive);

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
    async gallery(_, args: DirectoryArgs & PagedArgs, context) {
      const entries = await context.readDirectory(args.path, false);
      const canGallery = context.canGallery(entries);
      const folderName = pathToFolderName(args.path);
      const totalImagesCount = entries.filter(filterToFiles).length;
      let images: CRZImage[] = [];

      if (canGallery) {
        const start = args.page * args.size;
        const end = start + args.size;

        images = await context.readImages(entries, start, end);
      }

      return {
        canGallery,
        folderName,
        totalImagesCount,
        images
      };
    },
    async reel(_, args: DirectoryArgs, context) {
      const isRecursive = args.isRecursive ?? false;
      const entries = await context.readDirectory(args.path, isRecursive);
      const canReel = context.canReel(entries);
      const folderName = pathToFolderName(args.path);
      let videos: CRZVideo[] = [];

      if (canReel) {
        videos = await context.readVideos(entries, folderName);
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

      await writeFileAsync(
        path.resolve(__dirname, './targetPath.txt'),
        args.path
      );

      return {
        success: true,
        errorMessages: [],
        messages: []
      };
    }
  }
});
