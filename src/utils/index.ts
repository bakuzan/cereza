export function parseIfInt(val: string | number | null | undefined) {
  const maybeInt = parseInt(`${val}`, 10);
  return maybeInt === 0 || !!maybeInt ? maybeInt : val;
}

export const getEventValue = ({ type, checked, value }: HTMLInputElement) =>
  type === 'checkbox'
    ? checked
    : type === 'date' || type === 'text'
    ? value
    : parseIfInt(value);

export function prop<T, K extends keyof T>(obj: T, key: K) {
  return obj[key];
}

export function keys<T>(obj: T) {
  return Object.keys(obj) as (keyof T)[];
}

export const generateUniqueId = (): string =>
  (`${1e7}` + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (s) => {
    const c = Number(s);
    return (
      c ^
      (window.crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16);
  });

export function getPageFromHash(hash: string) {
  return Number(hash.split('_').pop());
}
