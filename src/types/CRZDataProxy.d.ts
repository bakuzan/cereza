import { DataProxy } from 'apollo-cache';

export interface CRZDataProxy extends DataProxy {
  readQuerySafeCRZ<T>(options: DataProxy.Query<T>): T;
  deleteQueryCRZ(name: string | string[]): void;
}
