export type Subscription = {
  chatId: string;
  repo: string;
  modes: ("push" | "issue" | "release")[];
  source: "user" | "default";
  createdAt: number;
};

export async function addSubscription(env: any, sub: Subscription) {
  const key = `sub:${sub.chatId}:${sub.repo}`;

  const existing = await env.GITNOTIFY_KV.get(key);
  if (existing) return JSON.parse(existing);

  await env.GITNOTIFY_KV.put(key, JSON.stringify(sub));

  return sub;
}

export async function getSubscriptionsByRepo(env: any, repo: string) {
  const list = await env.GITNOTIFY_KV.list({ prefix: "sub:" });

  const result: Subscription[] = [];

  for (const k of list.keys) {
    const raw = await env.GITNOTIFY_KV.get(k.name);
    if (!raw) continue;

    const sub = JSON.parse(raw);

    if (sub.repo === repo) {
      result.push(sub);
    }
  }

  return result;
}