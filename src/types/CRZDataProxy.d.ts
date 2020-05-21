import { DataProxy } from 'apollo-cache';

export interface CRZDataProxy extends DataProxy {
  readQuerySafeCRZ(options: DataProxy.Query<any>): any;
  deleteQueryCRZ(name: string | string[]): void;
}
