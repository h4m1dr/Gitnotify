import { mainMenu } from "./menu";
import { sendMessage } from "./send";
import { handleAddFlow } from "../state/addFlow";

export async function telegramRouter(env: any, msg: any) {
  const chatId = msg.chat.id;
  const text = (msg.text || "").trim();

  // =========================
  // START → FULL UI
  // =========================
  if (text === "/start") {
    return sendMessage(
      env,
      chatId,
      "🚀 Gitnotify Ready",
      mainMenu(false)
    );
  }

  // =========================
  // ADD FLOW
  // =========================
  const handled = await handleAddFlow.message(env, chatId, text);
  if (handled) return;

  return sendMessage(env, chatId, "Use /start");
}