import { isRepoEnabled } from "../repo/registry";
import { formatEvent } from "../telegram/ui";
import { sendMessage } from "../telegram/send";
import { getSubsByRepo } from "../repo/store";

export async function dispatchEvent(env: any, event: any) {
  const enabled = await isRepoEnabled(env, event.repo);
  if (!enabled) return;

  const subs = await getSubsByRepo(env, event.repo);

  for (const sub of subs) {
    if (!sub.modes.includes(event.type)) continue;

    const msg = formatEvent(event);

    await sendMessage(env, sub.chatId, msg);
  }
}