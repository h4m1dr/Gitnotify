import { addFlow } from "../state/addFlow";
import { sendMessage } from "./send";

export async function telegramRouter(
  env: any,
  msg: any,
  user: any
) {
  const chatId = String(msg.chat.id);
  const text = msg.text || "";

  // =========================
  // active add flow
  // =========================
  const handled = await addFlow.message(env, chatId, text);

  if (handled) {
    return;
  }

  // =========================
  // commands
  // =========================
  if (text === "/start") {
    return sendMessage(
      env,
      chatId,
      [
        "🚀 GitNotify",
        "",
        "Track GitHub repositories from Telegram.",
        "",
        "Commands:",
        "/add → add repository",
      ].join("\n")
    );
  }

  if (text === "/add") {
    return addFlow.start(env, chatId);
  }

  return sendMessage(
    env,
    chatId,
    "Use /start or /add"
  );
}