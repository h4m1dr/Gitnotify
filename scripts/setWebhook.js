// Auto webhook after deploy (CLEAN VERSION)

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const SECRET = process.env.TELEGRAM_WEBHOOK_SECRET;

// 👇 همیشه اتومات از Worker URL استفاده کن
const WORKER_URL = "https://gitnotify.hamidrn976.workers.dev";

if (!BOT_TOKEN || !SECRET) {
  console.error("Missing Cloudflare secrets");
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
  .then(r => r.json())
  .then(data => {
    console.log("Webhook result:", data);
  })
  .catch(err => {
    console.error("Webhook error:", err);
  });