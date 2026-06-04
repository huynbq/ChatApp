import { apiClient } from "@/api/http";
import type {
  Chat,
  CreateDirectChatInput,
  CreateGroupChatInput,
  CreateMessageInput,
  Message,
} from "@/types/types";

export const chatApi = {
  createDirectChat: async (input: CreateDirectChatInput) => {
    const { data } = await apiClient.post<Chat>(`/chats/direct`, input);
    return data;
  },
  createGroupChat: async (input: CreateGroupChatInput) => {
    const { data } = await apiClient.post<Chat>(`/chats/group`, input);
    return data;
  },
  createMessage: async (input: CreateMessageInput) => {
    const { chatId, ...body } = input;
    const { data } = await apiClient.post<Message>(
      `/chats/${chatId}/messages`,
      body,
    );

    return data;
  },
  getMessages: async (chatId: string) => {
    const { data } = await apiClient.get<Message[]>(
      `/chats/${chatId}/messages`,
      {
        params: {
          limit: 100,
        },
      },
    );

    return data;
  },
  getChats: async () => {
    const { data } = await apiClient.get<Chat[]>(`/chats`);
    return data;
  },
};
