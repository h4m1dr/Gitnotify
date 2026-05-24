import { extractRepo } from "../repo/extract";
import { addRepo } from "../repo/store";

const userState = new Map();

export async function handleMessage(env: any, chatId: string, text: string) {
  const state = userState.get(chatId);

  if (state === "WAIT_REPO") {
    const repo = extractRepo(text);

    if (!repo) {
      return send(env, chatId, "Invalid repo");
    }

    await addRepo(env, chatId, repo);

    userState.delete(chatId);

    return send(env, chatId, `Repo added: ${repo}`);
  }

  if (text === "/add") {
    userState.set(chatId, "WAIT_REPO");
    return send(env, chatId, "Send repo link");
  }

  return send(env, chatId, "Use /add");
}

async function send(env: any, chatId: string, text: string) {
  await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text })
  });
}