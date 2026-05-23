import { sendTelegramMessage } from "../telegram";

export async function handleReleaseEvent(body: any, env: any) {
  const repo = body.repository?.full_name;
  const release = body.release;

  if (!release) return;

  const message =
    `🚀 *New Release*\n` +
    `Repo: ${repo}\n` +
    `Name: ${release.name}\n` +
    `Tag: ${release.tag_name}\n` +
    `Author: ${release.author?.login}\n` +
    `\n${release.html_url}`;

  await sendTelegramMessage(
    env.TELEGRAM_BOT_TOKEN,
    env.TELEGRAM_CHAT_ID,
    message
  );
}