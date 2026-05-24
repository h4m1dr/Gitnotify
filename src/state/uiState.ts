const state = new Map<string, any>();

export function setState(chatId: string, data: any) {
  state.set(chatId, data);
}

export function getState(chatId: string) {
  return state.get(chatId);
}

export function clearState(chatId: string) {
  state.delete(chatId);
}