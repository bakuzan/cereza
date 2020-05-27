export interface DirectoryEntry {
  name: string;
  path: string;
  targetPath: string | null;
  parentName: string;
  isDirectory: boolean;
  isFile: boolean;
  isImage: boolean;
  isVideo: boolean;
  isShortcut: boolean;
}
