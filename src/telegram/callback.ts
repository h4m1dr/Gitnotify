import { addFlow } from "../state/addFlow";

export async function handleCallback(env: any, update: any) {
  const data = update.data;
  const chatId = update.message.chat.id;

  if (data === "add_repo") {
    return addFlow.start(env, chatId);
  }

  return;
}