import { handleAddFlow } from "../state/addFlow";
import { handleCallback } from "./callback";

export async function handleTelegram(req: Request, env: any) {
  const body = await req.json().catch(() => null);
  if (!body) return new Response("OK");

  if (body.callback_query) {
    return handleCallback(env, body.callback_query);
  }

  const msg = body.message;
  if (!msg) return new Response("OK");

  const chatId = msg.chat.id;
  const text = msg.text;

  await handleAddFlow.message(env, chatId, text);

  return new Response("OK");
}