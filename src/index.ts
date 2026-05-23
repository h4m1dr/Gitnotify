import { sendTelegramMessage, sendTelegramButtons } from "./telegram";
import { initUser, getUser, saveUser, listUsers } from "./storage";
import { handleCommitEvent } from "./handlers/commits";
import { handleReleaseEvent } from "./handlers/release";

export interface Env {
  TELEGRAM_BOT_TOKEN: string;
  TELEGRAM_WEBHOOK_SECRET: string;
  GITNOTIFY_KV: KVNamespace;
}

/**
 * CONFIG FLAGS (feature toggles)
 */
const CONFIG = {
  ENABLE_BOT: true,
  ENABLE_QUOTA: true,
  ENABLE_ADMIN_PANEL: true,
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (!CONFIG.ENABLE_BOT) {
      return new Response("Bot disabled");
    }

    // 🔐 webhook security
    const secret = request.headers.get("X-Telegram-Bot-Api-Secret-Token");
    if (secret !== env.TELEGRAM_WEBHOOK_SECRET) {
      return new Response("Unauthorized", { status: 401 });
    }

    const update = await request.json().catch(() => null);
    if (!update) return new Response("No update");

    const message = update.message;
    const callback = update.callback_query;

    if (callback) return handleCallback(callback, env);

    if (!message) return new Response("OK");

    const chatId = message.chat.id.toString();
    const userId = message.from.id.toString();
    const text = message.text || "";

    // 👤 ensure user exists
    const user = await initUser(env, userId);

    // /start
    if (text === "/start") {
      await sendTelegramMessage(
        env.TELEGRAM_BOT_TOKEN,
        chatId,
        "🚀 Gitnotify Active"
      );

      if (user.role === "admin") {
        await sendAdminPanel(env, chatId);
      }

      return new Response("OK");
    }

    // 📉 quota check
    if (CONFIG.ENABLE_QUOTA) {
      const allowed = await checkQuota(env, userId);
      if (!allowed) {
        await sendTelegramMessage(
          env.TELEGRAM_BOT_TOKEN,
          chatId,
          "⚠️ Daily limit reached"
        );
        return new Response("quota blocked");
      }
    }

    await sendTelegramMessage(
      env.TELEGRAM_BOT_TOKEN,
      chatId,
      `📩 Received: ${text}`
    );

    return new Response("OK");
  },
};

/**
 * QUOTA SYSTEM (clean & unified)
 */
async function checkQuota(env: Env, userId: string): Promise<boolean> {
  const today = new Date().toISOString().split("T")[0];
  const key = `quota:${userId}:${today}`;

  const raw = await env.GITNOTIFY_KV.get(key);
  const count = raw ? parseInt(raw) : 0;

  const user = await getUser(env, userId);
  const role = user?.role || "user";

  const limits: Record<string, number> = {
    user: 20,
    vip: 80,
    admin: 999999,
  };

  const limit = limits[role] || 10;

  if (count >= limit) return false;

  await env.GITNOTIFY_KV.put(key, String(count + 1), {
    expirationTtl: 86400,
  });

  return true;
}

/**
 * ADMIN PANEL
 */
async function sendAdminPanel(env: Env, chatId: string) {
  await sendTelegramButtons(env.TELEGRAM_BOT_TOKEN, chatId, "🧠 Admin Panel", [
    [{ text: "👥 Users", callback_data: "users" }],
    [{ text: "⭐ Promote VIP", callback_data: "vip" }],
    [{ text: "📊 Stats", callback_data: "stats" }],
  ]);
}

/**
 * CALLBACK HANDLER
 */
async function handleCallback(callback: any, env: Env) {
  const chatId = callback.message.chat.id.toString();
  const userId = callback.from.id.toString();

  const user = await getUser(env, userId);
  if (!user || user.role !== "admin") {
    return new Response("not allowed");
  }

  const data = callback.data;

  if (data === "users") {
    const users = await listUsers(env);

    await sendTelegramMessage(
      env.TELEGRAM_BOT_TOKEN,
      chatId,
      "👥 Users:\n" + users.join("\n")
    );
  }

  if (data === "stats") {
    const users = await listUsers(env);

    await sendTelegramMessage(
      env.TELEGRAM_BOT_TOKEN,
      chatId,
      `📊 Total users: ${users.length}`
    );
  }

  return new Response("OK");
}