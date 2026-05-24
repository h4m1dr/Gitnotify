const buffer = new Map<string, any[]>();

const MAX_BUFFER_SIZE = 50;

export function addToBuffer(repo: string, event: any) {
  if (!buffer.has(repo)) buffer.set(repo, []);

  const arr = buffer.get(repo)!;
  arr.push(event);

  if (arr.length > MAX_BUFFER_SIZE) {
    arr.shift(); // prevent memory leak
  }
}

export function flushBuffer(repo: string) {
  const items = buffer.get(repo) || [];
  buffer.delete(repo);
  return items;
}

export function getBuffer(repo: string) {
  return buffer.get(repo) || [];
}