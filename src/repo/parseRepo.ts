export function parseRepo(input: string): string | null {
  if (!input) return null;

  const text = input.trim();

  // https://github.com/owner/repo
  const match = text.match(/github\.com\/([^\/]+\/[^\/?#]+)/i);
  if (match) return match[1];

  // owner/repo format
  if (/^[\w-]+\/[\w.-]+$/.test(text)) {
    return text;
  }

  // fallback
  const fallback = text.split("github.com/")[1];
  if (fallback) {
    return fallback.split("/").slice(0, 2).join("/");
  }

  return null;
}