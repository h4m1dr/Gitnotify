// Simple auto webhook setter for Telegram Bot

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const WORKER_URL = process.env.WORKER_URL;
const SECRET = process.env.TELEGRAM_WEBHOOK_SECRET;

if (!BOT_TOKEN || !WORKER_URL || !SECRET) {
  console.error("Missing env vars");
  process.exit(1);
}

const url = `https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`;

const body = new URLSearchParams({
  url: WORKER_URL,
  secret_token: SECRET,
});

fetch(url, {
  method: "POST",
  body,
})
  .then(res => res.json())
  .then(data => {
    console.log("Webhook result:", data);
  })
  .catch(err => {
    console.error("Webhook error:", err);
  });