export const castStringToBool = (val: string | undefined) =>
  val === 'true' ? true : val === 'false' ? false : !!val;
