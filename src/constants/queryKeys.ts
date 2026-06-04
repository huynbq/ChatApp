export const queryKeys = {
  all: ["app"] as const,
  auth: {
    all: ["auth"] as const,
    session: () => ["auth", "session"] as const,
  },
  chat: {
    all: ["chat"] as const,
    messages: (chatId: string | undefined) =>
      ["chat", "messages", chatId] as const,
  },
  user: {
    all: ["user"] as const,
    list: (params: { search: string }) => ["user", params],
  },
};
