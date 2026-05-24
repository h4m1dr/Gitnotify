import { handleMessage } from "../state/store";

export async function handleTelegram(req: Request, env: any) {
  const body = await req.json().catch(() => null);
  if (!body?.message) return new Response("OK");

  const msg = body.message;

  const chatId = msg.chat.id;
  const text = msg.text;

  await handleMessage(env, chatId, text);

  return new Response("OK");
}