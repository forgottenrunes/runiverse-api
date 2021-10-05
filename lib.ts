export const truncate = (input: string, length: number = 280) =>
  input.length > length ? `${input.substring(0, length)}...` : input;
