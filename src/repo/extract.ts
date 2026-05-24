export function extractRepo(input: string): string | null {
  const match = input.match(/github\.com\/([^\/]+\/[^\/?#]+)/i);
  if (match) return match[1];

  if (input.includes("/") && input.split("/").length === 2) {
    return input;
  }

  return null;
}