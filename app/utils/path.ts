export const lastSegment = (path: string) => path.split('/').at(-1) ?? path;

export const removeFirstSegmet = (path: string) => {
  let p = path;
  if (p.startsWith('/')) {
    p = p.substring(1);
  }
  return p.substring(p.indexOf('/') + 1);
};

export const removeStartSegmets = (path: string, count = 1) => {
  let i = 0;
  let p = path;
  while (i < count) {
    p = removeFirstSegmet(p);
    i++;
  }
  return p;
};
