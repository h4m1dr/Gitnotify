export function mainMenu(isAdmin: boolean) {
  const base = [
    [{ text: "📦 My Repositories", callback_data: "page:repos" }],
    [{ text: "➕ Add Repository", callback_data: "page:add" }],
    [{ text: "⚙️ Settings", callback_data: "page:settings" }],
  ];

  if (isAdmin) {
    base.push([{ text: "🛠 Admin Panel", callback_data: "page:admin" }]);
  }

  return base;
}