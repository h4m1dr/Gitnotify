export async function listUserRepos(env: any, chatId: string) {
  const list = await env.GITNOTIFY_KV.list({ prefix: `sub:${chatId}:` });

  const repos = [];

  for (const k of list.keys) {
    const raw = await env.GITNOTIFY_KV.get(k.name);
    if (!raw) continue;

    repos.push(JSON.parse(raw));
  }

  return repos;
}