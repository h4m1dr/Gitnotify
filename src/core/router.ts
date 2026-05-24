import { handleGitHub } from "../github/handler";
import { handleTelegram } from "../telegram/bot";

export async function router(req: Request, env: any, ctx: any) {
  const url = new URL(req.url);

  if (url.pathname === "/github") {
    const payload = await req.json();
    return handleGitHub(req, env, payload);
  }

  return handleTelegram(req, env);
}