import { sendTelegramMessage } from "./telegram";

export interface Env {
  TELEGRAM_BOT_TOKEN: string;
  TELEGRAM_WEBHOOK_SECRET: string;
  GITNOTIFY_KV: KVNamespace;
}

const CONFIG = {
  ENABLE_BOT: true,
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (!CONFIG.ENABLE_BOT) {
      return new Response("Bot disabled");
    }

    const url = new URL(request.url);

    // 🟢 1. GitHub Webhook Route
    if (url.pathname === "/github") {
      return handleGitHub(request, env);
    }

    // 🟢 2. Telegram Webhook Route
    return handleTelegram(request, env);
  },
};

// =========================
// 🔥 GitHub Handler
// =========================
async function handleGitHub(request: Request, env: Env) {
  const event = request.headers.get("x-github-event");

  const body = await request.json().catch(() => null);
  if (!body) return new Response("Invalid GitHub payload", { status: 400 });

  let message = "GitHub event received";

  // 🟢 PUSH EVENT
  if (event === "push") {
    const repo = body.repository?.full_name;
    const pusher = body.pusher?.name;
    const commits = body.commits?.length || 0;

    message = `🚀 PUSH EVENT\nRepo: ${repo}\nBy: ${pusher}\nCommits: ${commits}`;
  }

  // 🟢 RELEASE EVENT
  if (event === "release") {
    const repo = body.repository?.full_name;
    const tag = body.release?.tag_name;

    message = `🎉 RELEASE\nRepo: ${repo}\nTag: ${tag}`;
  }

  await sendTelegramMessage(
    env.TELEGRAM_BOT_TOKEN,
    "<CHAT_ID>", // بعداً dynamic می‌کنیم
    message
  );

  return new Response("OK");
}

// =========================
// 🔥 Telegram Handler (فعلاً ساده)
// =========================
async function handleTelegram(request: Request, env: Env) {
  const secret = request.headers.get("X-Telegram-Bot-Api-Secret-Token");
  if (secret !== env.TELEGRAM_WEBHOOK_SECRET) {
    return new Response("Unauthorized", { status: 401 });
  }

  const update = await request.json().catch(() => null);
  if (!update) return new Response("No update");

  const message = update.message;
  if (!message) return new Response("OK");

  const chatId = message.chat.id.toString();
  const text = message.text || "";

  if (text === "/start") {
    await sendTelegramMessage(
      env.TELEGRAM_BOT_TOKEN,
      chatId,
      "Gitnotify Active 🚀"
    );
  }

  return new Response("OK");
}