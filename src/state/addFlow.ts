import { extractRepo } from "../repo/extract";
import { addRepo } from "../repo/store";
import { sendMessage } from "../telegram/send";

const waiting = new Map<string, boolean>();

export const handleAddFlow = {
  start(env: any, chatId: string) {
    waiting.set(chatId, true);
    return sendMessage(env, chatId, "Send GitHub repo link");
  },

  async message(env: any, chatId: string, text: string) {
    if (!waiting.has(chatId)) return false;

    const repo = extractRepo(text);

    if (!repo) {
      return sendMessage(env, chatId, "❌ Invalid repo format");
    }

    await addRepo(env, chatId, repo);

    waiting.delete(chatId);

    return sendMessage(env, chatId, `✅ Added repo: ${repo}`);
  }
};