import path from 'path';
import audioExtensions from 'audio-extensions';
import imageExtensions from 'image-extensions';
import videoExtensions from 'video-extensions';

const audExts = new Set(audioExtensions);
const imgExts = new Set(imageExtensions);
const vidExts = new Set(videoExtensions);

const checkExtensionIsIn = (extensions: Set<string>) => (filePath: string) =>
  extensions.has(
    path
      .extname(filePath)
      .slice(1)
      .toLowerCase()
  );

export const isAudio = checkExtensionIsIn(audExts);
export const isImage = checkExtensionIsIn(imgExts);
export const isVideo = checkExtensionIsIn(vidExts);
export const isShortcut = checkExtensionIsIn(new Set(['lnk']));

export const isDirectory = (filePath: string) => path.extname(filePath) === '';
export const isFile = (filePath: string) => path.extname(filePath) !== '';
