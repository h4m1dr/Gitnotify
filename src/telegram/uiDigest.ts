// src/telegram/uiDigest.ts

export function formatDigest(repo: string, summary: any, events: any[]) {
  return `
🧾 *Digest Report*

📦 Repo: ${repo}

📊 Summary:
- Push: ${summary.push}
- Issues: ${summary.issue}
- Releases: ${summary.release}

📌 Details:
${events
  .slice(0, 5)
  .map((e) => `- ${e.type}: ${e.actor || "unknown"}`)
  .join("\n")}
`;
}