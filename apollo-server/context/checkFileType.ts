import path from 'path';
import imageExtensions from 'image-extensions';
import videoExtensions from 'video-extensions';

const imgExts: Set<string> = new Set(imageExtensions);
const vidExts: Set<string> = new Set(videoExtensions);

const checkExtensionIsIn = (extensions: Set<string>) => (filePath: string) =>
  extensions.has(
    path
      .extname(filePath)
      .slice(1)
      .toLowerCase()
  );

export const isImage = checkExtensionIsIn(imgExts);
export const isVideo = checkExtensionIsIn(vidExts);
