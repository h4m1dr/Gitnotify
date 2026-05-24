import { handleGitHub } from "../github/handler";
import { handleTelegram } from "../telegram/bot";

export async function router(req: Request, env: any, ctx: any) {
  const url = new URL(req.url);

  // =========================
  // GitHub webhook
  // =========================
  if (url.pathname === "/github") {
    if (req.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    const payload = await req.json().catch(() => null);
    if (!payload) {
      return new Response("Invalid JSON", { status: 400 });
    }

    return handleGitHub(req, env, payload);
  }

  // =========================
  // Telegram webhook
  // =========================
  return handleTelegram(req, env);
}