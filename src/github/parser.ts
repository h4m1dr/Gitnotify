export function parseGitHubEvent(headers: Headers, body: any) {
  const type = headers.get("X-GitHub-Event");

  return {
    type,
    repo: body.repository?.full_name,
    actor: body.sender?.login,
    branch: body.ref,
    commit: body.head_commit?.message,
    url: body.repository?.html_url,
    raw: body
  };
}