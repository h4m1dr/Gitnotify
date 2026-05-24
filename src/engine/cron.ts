import { processDigest } from "./digest";
import { getSubsByRepo } from "../repo/store";

/**
 * Runs every X minutes via Cloudflare cron
 */
export async function runDigestCron(env: any) {
  const repos = await env.GITNOTIFY_KV.list({ prefix: "repo:" });

  for (const r of repos.keys) {
    const repo = r.name.replace("repo:", "");

    const subs = await getSubsByRepo(env, repo);

    const chatIds = subs.map((s: any) => s.chatId);

    await processDigest(env, repo, chatIds);
  }
}