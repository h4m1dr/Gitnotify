import { registerRepo } from "../repo/registry";
import { parseGitHubEvent } from "./parser";
import { dispatchEvent } from "../engine/dispatcher";

export async function handleGitHub(req: Request, env: any, body: any) {
  const event = parseGitHubEvent(req.headers, body);

  if (!event.repo) {
    return new Response("No repo", { status: 400 });
  }

  await registerRepo(env, event.repo, "user");

  await dispatchEvent(env, event);

  return new Response("OK");
}