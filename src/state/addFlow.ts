const stateMap = new Map<string, string>();

function send(env: any, chatId: string, text: string) {
  return fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text })
  });
}

function parseRepo(text: string): string | null {
  if (!text) return null;

  const match = text.match(/github\.com\/([^\/]+\/[^\/?#]+)/i);
  if (match) return match[1];

  if (text.includes("/") && text.split("/").length === 2) {
    return text.trim();
  }

  return null;
}

function addSubscription(env: any, chatId: string, repo: string) {
  const key = `sub:${chatId}:${repo}`;

  return env.GITNOTIFY_KV.put(
    key,
    JSON.stringify({
      chatId,
      repo,
      modes: ["push", "issue", "release"]
    })
  );
}

export const addFlow = {
  async start(env: any, chatId: string) {
    stateMap.set(chatId, "WAIT_REPO");

    await send(env, chatId, "📦 Send GitHub repo URL or owner/repo");
  },

  async message(env: any, chatId: string, text: string) {
    if (stateMap.get(chatId) !== "WAIT_REPO") return false;

    const repo = parseRepo(text);

    if (!repo) {
      await send(env, chatId, "❌ Invalid repo format");
      return true;
    }

    await addSubscription(env, chatId, repo);

    stateMap.delete(chatId);

    await send(env, chatId, `✅ Repo added: ${repo}`);

    return true;
  }
};