export const castStringToBool = (val: string | undefined) =>
  val === 'true' ? true : val === 'false' ? false : !!val;

export const pathToFolderName = (str: string) => str.split('\\').pop() || '';
