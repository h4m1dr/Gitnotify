import { registerRepo } from "../repo/registry";
import { parseGitHubEvent } from "./parser";
import { dispatchEvent } from "../engine/dispatcher";

export async function handleGitHub(req: Request, env: any, body: any) {
  const event = parseGitHubEvent(req.headers, body);

  // auto-register repo if not exists
  await registerRepo(env, event.repo, "user");

  await dispatchEvent(env, event);

  return new Response("OK");
}