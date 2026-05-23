import { handleCommitEvent } from "./handlers/commits";
import { handleReleaseEvent } from "./handlers/release";

export async function handleGitHubEvent(body: any, env: any) {
  const event = body.action || body.ref ? "push" : "unknown";

  if (event === "push") {
    return handleCommitEvent(body, env);
  }

  if (body.release) {
    return handleReleaseEvent(body, env);
  }
}