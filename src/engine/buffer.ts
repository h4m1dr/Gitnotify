// src/engine/buffer.ts

const buffer = new Map<string, any[]>();

export function addToBuffer(repo: string, event: any) {
  if (!buffer.has(repo)) buffer.set(repo, []);

  buffer.get(repo)!.push(event);
}

export function flushBuffer(repo: string) {
  const items = buffer.get(repo) || [];
  buffer.delete(repo);
  return items;
}

export function getBuffer(repo: string) {
  return buffer.get(repo) || [];
}