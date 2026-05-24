export async function addRepo(env: any, chatId: string, repo: string) {
  const key = `sub:${chatId}:${repo}`;

  await env.GITNOTIFY_KV.put(
    key,
    JSON.stringify({
      chatId,
      repo,
      modes: ["push", "issue", "release"]
    })
  );
}

export async function getSubsByRepo(env: any, repo: string) {
  const list = await env.GITNOTIFY_KV.list({ prefix: "sub:" });

  const result = [];

  for (const key of list.keys) {
    const raw = await env.GITNOTIFY_KV.get(key.name);
    if (!raw) continue;

    const sub = JSON.parse(raw);

    if (sub.repo === repo) {
      result.push(sub);
    }
  }

  return result;
}