const navState = new Map<string, string>();

export function setPage(chatId: string, page: string) {
  navState.set(chatId, page);
}

export function getPage(chatId: string) {
  return navState.get(chatId) || "home";
}

export function clearPage(chatId: string) {
  navState.delete(chatId);
}