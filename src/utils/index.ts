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
