import { CONFIG } from "./config";
import { getUser, saveUser } from "./storage";

export async function checkQuota(env: any, userId: string) {
  const user = await getUser(env, userId);
  if (!user) return false;

  const now = Date.now();

  // reset window
  if (now - user.resetAt > CONFIG.RESET_WINDOW_MS) {
    user.used = 0;
    user.resetAt = now;
  }

  const limit = CONFIG.LIMITS[user.role] || 1;

  if (user.used >= limit) {
    await saveUser(env, userId, user);
    return false;
  }

  user.used++;
  await saveUser(env, userId, user);

  return true;
}