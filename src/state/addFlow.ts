import { extractRepo } from "../repo/extract";
import { addRepo } from "../repo/store";
import { sendMessage } from "../telegram/send";
import { getState, setState, clearState } from "./uiState";

export const addFlow = {
  start(env: any, chatId: string) {
    setState(chatId, "WAIT_REPO");

    return sendMessage(env, chatId,
      "📦 Send GitHub repo (URL or owner/repo)"
    );
  },

  async message(env: any, chatId: string, text: string) {
    const state = getState(chatId);

    if (state !== "WAIT_REPO") return false;

    const repo = extractRepo(text);

    if (!repo) {
      return sendMessage(env, chatId, "❌ Invalid repo");
    }

    await addRepo(env, chatId, repo);

    clearState(chatId);

    return sendMessage(env, chatId, `✅ Added repo: ${repo}`);
  }
};