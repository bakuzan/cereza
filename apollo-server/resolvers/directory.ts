import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

import { DirectoryArgs } from '@i/DirectoryArgs';
import { ConfirmationResponse } from '@i/ConfirmationResponse';
import { CRZImage } from '@i/CRZImage';
import { CRZMedia } from '@i/CRZMedia';
import { PagedArgs } from '@i/PagedArgs';
import { SortOptions } from '@i/SortOptions';

import { pathToFolderName, filterToFiles } from '@s/utils';
import createResolver from '@s/utils/createResolver';

const writeFileAsync = promisify(fs.writeFile);
const defaultSort: SortOptions = {
  field: 'Name',
  order: 'ASC'
};

export default createResolver({
  Query: {
    async directory(_, args: DirectoryArgs, context) {
      const isRecursive = args.isRecursive ?? false;
      const sorting = args.sort ?? defaultSort;
      const directoryEntries = await context.readDirectory(
        args.path,
        isRecursive
      );

      const isTitle = sorting.field === 'Name';
      const isDesc = sorting.order === 'DESC';
      const entries = directoryEntries.sort((a, b) => {
        if (a.isDirectory !== b.isDirectory) {
          return b.isDirectory ? 1 : -1;
        }

        if (isTitle) {
          return isDesc
            ? b.name.localeCompare(a.name)
            : a.name.localeCompare(b.name);
        } else {
          return isDesc ? (b.date < a.date ? -1 : 1) : b.date < a.date ? 1 : -1;
        }
      });

      return {
        canGallery: context.canGallery(directoryEntries),
        canReel: context.canReel(directoryEntries),
        entries
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
      const sorting = args.sort ?? defaultSort;
      const entries = await context.readDirectory(args.path, isRecursive);
      const canReel = context.canReel(entries);
      const folderName = pathToFolderName(args.path);
      let media: CRZMedia[] = [];

      if (canReel) {
        media = await context.readReel(entries, folderName, sorting);
      }

      return {
        canReel,
        folderName,
        media
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
