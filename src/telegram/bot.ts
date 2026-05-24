import { handleCallback } from "./callback";
import { telegramRouter } from "./router";

export async function handleTelegram(req: Request, env: any) {
  const body = await req.json().catch(() => null);
  if (!body) return new Response("OK");

  // callback buttons
  if (body.callback_query) {
    return handleCallback(env, body.callback_query);
  }

  const msg = body.message;
  if (!msg) return new Response("OK");

  const chatId = msg.chat.id;

  // simple user object (phase 4 placeholder)
  const user = { chatId };

  await telegramRouter(env, msg, user);

  return new Response("OK");
}