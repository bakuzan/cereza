export interface DirectoryEntry {
  name: string;
  path: string;
  date: Date;
  level: number;
  targetPath: string | null;
  parentName: string;
  isDirectory: boolean;
  isFile: boolean;
  isAudio: boolean;
  isImage: boolean;
  isVideo: boolean;
  isShortcut: boolean;
}
