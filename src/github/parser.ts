export function parseGitHubEvent(headers: Headers, body: any) {
  const type = headers.get("X-GitHub-Event") || "unknown";

  let normalized: "push" | "issue" | "release" | "unknown" = "unknown";

  if (type === "push") normalized = "push";
  if (type === "issues") normalized = "issue";
  if (type === "issue_comment") normalized = "issue";
  if (type === "release") normalized = "release";

  return {
    type: normalized,
    repo: body.repository?.full_name,
    actor: body.sender?.login,
    branch: body.ref,
    commit: body.head_commit?.message,
    url: body.repository?.html_url,
    raw: body
  };
}