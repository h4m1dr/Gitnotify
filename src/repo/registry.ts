// src/repo/registry.ts

export type RepoPolicy = {
  repo: string;
  type: "default" | "user" | "admin";
  enabled: boolean;
  createdAt: number;
  ownerId?: string;
};

/**
 * GLOBAL REPO REGISTRY
 * This is the single source of truth for repos in system
 */

function key(repo: string) {
  return `repo:${repo}`;
}

/**
 * Add repo to global registry
 */
export async function registerRepo(
  env: any,
  repo: string,
  type: "default" | "user" | "admin" = "user",
  ownerId?: string
) {
  const exists = await env.GITNOTIFY_KV.get(key(repo));
  if (exists) return JSON.parse(exists);

  const data: RepoPolicy = {
    repo,
    type,
    enabled: true,
    createdAt: Date.now(),
    ownerId,
  };

  await env.GITNOTIFY_KV.put(key(repo), JSON.stringify(data));

  return data;
}

/**
 * Get repo policy
 */
export async function getRepo(env: any, repo: string) {
  const raw = await env.GITNOTIFY_KV.get(key(repo));
  return raw ? JSON.parse(raw) : null;
}

/**
 * Check if repo is enabled
 */
export async function isRepoEnabled(env: any, repo: string) {
  const data = await getRepo(env, repo);
  return data?.enabled === true;
}

/**
 * Disable repo (admin only later)
 */
export async function disableRepo(env: any, repo: string) {
  const data = await getRepo(env, repo);
  if (!data) return false;

  data.enabled = false;

  await env.GITNOTIFY_KV.put(key(repo), JSON.stringify(data));
  return true;
}

/**
 * List all repos
 */
export async function listRepos(env: any) {
  const list = await env.GITNOTIFY_KV.list({ prefix: "repo:" });

  const repos = [];

  for (const item of list.keys) {
    const raw = await env.GITNOTIFY_KV.get(item.name);
    if (!raw) continue;

    repos.push(JSON.parse(raw));
  }

  return repos;
}

/**
 * Default system repos bootstrap
 */
export async function bootstrapDefaultRepos(env: any) {
  const defaults = [
    "vercel/next.js",
    "cloudflare/workers-sdk",
    "microsoft/vscode",
  ];

  for (const repo of defaults) {
    await registerRepo(env, repo, "default");
  }
}