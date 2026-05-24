import { formatEvent } from "../telegram/ui";
import { sendMessage } from "../telegram/send";
import { getSubsByRepo } from "../repo/store";
import { evaluateEventRules } from "./rules";
import { addToBuffer } from "./buffer";
import { isRepoEnabled } from "../repo/registry";

export async function dispatchEvent(env: any, event: any) {
  const enabled = await isRepoEnabled(env, event.repo);
  if (!enabled) return;

  const rule = evaluateEventRules(event);

  if (!rule.allow) return;

  const subs = await getSubsByRepo(env, event.repo);

  // =========================
  // PUSH / RELEASE → instant
  // =========================
  if (rule.delay === 0) {
    for (const sub of subs) {
      if (!sub.modes.includes(event.type)) continue;

      const msg = formatEvent(event);
      await sendMessage(env, sub.chatId, msg);
    }
    return;
  }

  // =========================
  // ISSUE → buffered
  // =========================
  addToBuffer(event.repo, event);

  return;
}