import { handleGitHub } from "../github/handler";
import { handleTelegram } from "../telegram/bot";
import { verifyGitHubSignature } from "../security/githubSignature";

export async function router(req: Request, env: any, ctx: any) {
  const url = new URL(req.url);

  // =========================
  // GitHub webhook
  // =========================
  if (url.pathname === "/github") {
    if (req.method !== "POST") {
      return new Response("Method not allowed", {
        status: 405,
      });
    }

    const rawBody = await req.text();

    const verified = await verifyGitHubSignature(
      req,
      env,
      rawBody
    );

    if (!verified) {
      return new Response("Invalid signature", {
        status: 401,
      });
    }

    const payload = JSON.parse(rawBody);

    return handleGitHub(req, env, payload);
  }

  // =========================
  // Telegram webhook
  // =========================
  return handleTelegram(req, env);
}