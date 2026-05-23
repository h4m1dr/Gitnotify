export async function getUser(env: any, userId: string) {
  const raw = await env.GITNOTIFY_KV.get(`user:${userId}`);
  return raw ? JSON.parse(raw) : null;
}

export async function saveUser(env: any, userId: string, data: any) {
  await env.GITNOTIFY_KV.put(`user:${userId}`, JSON.stringify(data));
}

export async function initUser(env: any, userId: string, chatId: string) {
  let user = await getUser(env, userId);

  if (!user) {
    user = {
      id: userId,
      chatId,
      role: "user",
      used: 0,
      resetAt: Date.now(),
      enabled: true,
    };

    await saveUser(env, userId, user);
  }

  return user;
}

export async function listUsers(env: any) {
  const list = await env.GITNOTIFY_KV.list({ prefix: "user:" });
  return list.keys.map((k: any) => k.name.replace("user:", ""));
}