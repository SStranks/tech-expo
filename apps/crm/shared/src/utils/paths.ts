export function tailPath(path: string, maxLength = 60): string {
  if (path.length <= maxLength) return path;
  const maxPath = `${path.slice(-maxLength + 3)}`;
  const firstSlash = maxPath.indexOf('/');
  return `...${maxPath.slice(firstSlash)}`;
}
