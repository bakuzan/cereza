import { CRZContext } from './CRZContext';

export type CRZResolver = (
  rooResolver: any,
  args: any,
  context: CRZContext
) => Promise<any>;

export interface CRZResolvers {
  Query?: { [key: string]: CRZResolver };
  Mutation?: { [key: string]: CRZResolver };
}
