import { DataProxy } from 'apollo-cache';
import { InMemoryCache, defaultDataIdFromObject } from 'apollo-cache-inmemory';

export default () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const proto = InMemoryCache.prototype as any;

  proto.readQuerySafeCRZ = function readQuerySafe<T>(
    options: DataProxy.Query<T>
  ) {
    try {
      return this.readQuery(options);
    } catch (e) {
      return {};
    }
  };

  proto.deleteQueryCRZ = function deleteQuery(name: string | string[]) {
    const names = name instanceof Array ? name : [name];
    const rootQuery = this.extract().ROOT_QUERY;

    if (!rootQuery) {
      return;
    }

    Object.keys(rootQuery)
      .filter((query) => names.some((name) => query.indexOf(name) === 0))
      .forEach((query) => {
        delete rootQuery[query];
      });
  };

  return new InMemoryCache({
    dataIdFromObject: (object) => {
      switch (object.__typename) {
        default:
          return defaultDataIdFromObject(object);
      }
    }
  });
};
