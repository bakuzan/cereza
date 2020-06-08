/* eslint-disable @typescript-eslint/no-unused-vars */
import { CRZSettings } from '@i/CRZSettings';
import { keys, prop, generateUniqueId } from '@/utils';

class Store<T> {
  private storeName: string;
  private defaultValue: T;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  private subscribers: Map<keyof T, any[]> = new Map([]);

  constructor(storeName: string, defaultValue: T) {
    this.storeName = storeName;
    this.defaultValue = defaultValue;
  }

  private get storage() {
    return typeof localStorage !== 'undefined'
      ? localStorage
      : {
          getItem: (key: string) => '',
          setItem: (key: string, value: string) => ({})
        };
  }

  public get(): T {
    const item = this.storage.getItem(this.storeName) || '';
    const data = (item ? JSON.parse(item) : this.defaultValue) as T;

    return { ...this.defaultValue, ...data };
  }

  public getKey<K extends keyof T>(key: K) {
    const item = this.storage.getItem(this.storeName) || '';
    const data = (item ? JSON.parse(item) : this.defaultValue) as T;

    return prop(data, key) ?? prop(this.defaultValue, key);
  }

  public set(mergeValues: Partial<T>): T {
    const values = this.get();
    const updated: T = { ...values, ...mergeValues };

    this.notify(mergeValues);
    this.storage.setItem(this.storeName, JSON.stringify(updated));
    return updated;
  }

  public replace(newValue: T): T {
    const data = JSON.stringify(newValue);

    this.notify(newValue);
    this.storage.setItem(this.storeName, data);
    return this.get() as T;
  }

  public upgrade(...upgradeFns: ((data: Partial<T>) => Partial<T>)[]) {
    const data: Partial<T> = this.get();
    const upgradedData = upgradeFns.reduce((upD, f) => f(upD), data);

    this.replace(upgradedData as T);
  }

  public subscribe<K extends keyof T>(key: K, callback: (value: T[K]) => void) {
    const id = generateUniqueId();
    const calls = this.subscribers.get(key) ?? [];
    this.subscribers.set(key, [...calls, { id, callback }]);

    return () => {
      const items = this.subscribers.get(key) ?? [];

      this.subscribers.set(
        key,
        items.filter((x) => x.id !== id)
      );
    };
  }

  // Private methods
  private notify(newValues: T | Partial<T>) {
    const values = newValues as T;

    keys(values).forEach((key) => {
      const calls = this.subscribers.get(key) ?? [];
      const value = values[key];

      calls.forEach((sub) => sub.callback(value));
    });
  }
}

const store = new Store<CRZSettings>('crzSettings', {
  galleryFallbackModes: [],
  theme: 'classic'
});

export { store };
