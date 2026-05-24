import { handleCallback } from "./callback";
import { telegramRouter } from "./messageRouter";

function verifyTelegram(req: Request, env: any) {
  const secret = req.headers.get(
    "X-Telegram-Bot-Api-Secret-Token"
  );

  return secret === env.TELEGRAM_WEBHOOK_SECRET;
}

export async function handleTelegram(req: Request, env: any) {
  const body = await req.json().catch(() => null);

  if (!verifyTelegram(req, env)) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  if (!body) {
    return new Response("OK");
  }

  // =========================
  // callback buttons
  // =========================
  if (body.callback_query) {
    await handleCallback(env, body.callback_query);

    return new Response("OK");
  }

  // =========================
  // normal message
  // =========================
  const msg = body.message;

  if (!msg) {
    return new Response("OK");
  }

  const user = {
    chatId: String(msg.chat.id),
  };

  await telegramRouter(env, msg, user);

  return new Response("OK");
}