import { sendMessage } from "./send";
import { mainMenu } from "./menu";
import { addFlow } from "../state/addFlow";
import { setPage } from "./navigation";
import { listUserRepos } from "../repo/userRepos";

export async function handleCallback(env: any, update: any) {
  const data = update.data;
  const chatId = update.message.chat.id;

  // =========================
  // NAVIGATION ROUTES
  // =========================
  if (data.startsWith("page:")) {
    const page = data.split(":")[1];
    setPage(chatId, page);

    if (page === "repos") {
      const repos = await listUserRepos(env, chatId);

      const text =
        "📦 Your Repositories:\n\n" +
        repos.map(r => `• ${r.repo}`).join("\n");

      return sendMessage(env, chatId, text);
    }

    if (page === "add") {
      return addFlow.start(env, chatId);
    }

    if (page === "settings") {
      return sendMessage(env, chatId, "⚙️ Settings panel (coming soon)");
    }

    if (page === "admin") {
      return sendMessage(env, chatId, "🛠 Admin Panel");
    }
  }

  // =========================
  // OLD ACTIONS (compat)
  // =========================
  if (data === "add_repo") {
    return addFlow.start(env, chatId);
  }

  if (data === "list_repos") {
    const repos = await listUserRepos(env, chatId);

    return sendMessage(
      env,
      chatId,
      repos.map(r => r.repo).join("\n")
    );
  }

  return sendMessage(env, chatId, "Unknown action");
}