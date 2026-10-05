export const createPortToken = (name: string): symbol =>
  Symbol.for(`PORT:${name}`);
