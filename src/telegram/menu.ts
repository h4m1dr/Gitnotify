export function mainMenu(isAdmin: boolean) {
  const base = [
    [{ text: "➕ Add Repo", callback_data: "add_repo" }],
    [{ text: "📂 My Repos", callback_data: "list_repos" }],
  ];

  if (isAdmin) {
    base.push([{ text: "🛠 Admin Panel", callback_data: "admin" }]);
  }

  return base;
}