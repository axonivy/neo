export const lastSegment = (path: string) => path.split('/').at(-1) ?? path;

export const removeFirstSegmet = (path: string) => {
  let p = path;
  if (p.startsWith('/')) {
    p = p.substring(1);
  }
  return p.substring(p.indexOf('/') + 1);
};
