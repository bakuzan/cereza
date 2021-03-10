import { SortOptions } from './SortOptions';

export interface DirectoryArgs extends Record<string, any> {
  path: string;
  isRecursive?: boolean;
  sort?: SortOptions;
}
