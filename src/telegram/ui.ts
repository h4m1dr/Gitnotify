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
Tag update`;
  }

  if (event.type === "issues") {
    return `🐛 ISSUE
Repo: ${event.repo}`;
  }

  return `🔔 Update: ${event.repo}`;
}