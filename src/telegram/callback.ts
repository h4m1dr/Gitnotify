import { handleAddFlow } from "../state/addFlow";
import { sendMessage } from "./send";

export async function handleCallback(env: any, update: any) {
  const data = update.data;
  const chatId = update.message.chat.id;

  if (data === "add_repo") {
    await handleAddFlow.start(env, chatId);
    return new Response("OK");
  }

  if (data === "list_repos") {
    await sendMessage(env, chatId, "📦 Your repos will appear here soon.");
    return new Response("OK");
  }

  if (data === "admin") {
    await sendMessage(env, chatId, "🔐 Admin panel (coming next phase)");
    return new Response("OK");
  }

  return new Response("OK");
}