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

  const subs = await getSubsByRepo(env, event.repo);

  // =========================
  // REALTIME EVENTS
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
  // BATCHED EVENTS
  // =========================
  addToBuffer(event.repo, event);
}