import { sendTelegramMessage } from "../telegram";

export async function handleCommitEvent(body: any, env: any) {
  const repo = body.repository?.full_name;
  const commits = body.commits || [];
  const pusher = body.pusher?.name;

  if (!commits.length) return;

  let message = `🔥 *New Push*\n`;
  message += `Repo: ${repo}\n`;
  message += `By: ${pusher}\n\n`;

  for (const c of commits.slice(0, 5)) {
    message += `• ${c.message}\n`;
    message += `  ${c.url}\n\n`;
  }

  await sendTelegramMessage(
    env.TELEGRAM_BOT_TOKEN,
    env.TELEGRAM_CHAT_ID,
    message
  );
}