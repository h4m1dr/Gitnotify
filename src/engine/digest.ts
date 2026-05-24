// src/engine/digest.ts

import { getBuffer, flushBuffer } from "./buffer";
import { sendMessage } from "../telegram/send";
import { formatDigest } from "../telegram/uiDigest";

/**
 * Build digest for a repo
 */
export function buildDigest(events: any[]) {
  const summary = {
    push: 0,
    issue: 0,
    release: 0,
  };

  for (const e of events) {
    if (summary[e.type] !== undefined) {
      summary[e.type]++;
    }
  }

  return summary;
}

/**
 * Process digest for a repo
 */
export async function processDigest(env: any, repo: string, chatIds: string[]) {
  const events = flushBuffer(repo);

  if (!events.length) return;

  const summary = buildDigest(events);

  const message = formatDigest(repo, summary, events);

  for (const chatId of chatIds) {
    await sendMessage(env, chatId, message);
  }
}