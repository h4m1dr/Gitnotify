export function formatEvent(event: any) {
  if (event.type === "push") {
    return `📦 PUSH
Repo: ${event.repo}
By: ${event.actor}
Commit: ${event.commit}`;
  }

  if (event.type === "release") {
    return `🚀 RELEASE
Repo: ${event.repo}
Tag updated`;
  }

  if (event.type === "issue") {
    return `🐛 ISSUE
Repo: ${event.repo}
Actor: ${event.actor}`;
  }

  return `🔔 Update: ${event.repo}`;
}