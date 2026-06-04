import { apiClient } from "@/api/http";
import type { CreateMessageInput, Message } from "@/types/types";

export const chatApi = {
  createMessage: async (input: CreateMessageInput) => {
    const { chatId, ...body } = input;
    const { data } = await apiClient.post<Message>(`/chats/${chatId}/messages`, body);

    return data;
  },
  getMessages: async (chatId: string) => {
    const { data } = await apiClient.get<Message[]>(`/chats/${chatId}/messages`, {
      params: {
        limit: 100,
      },
    });

    return data;
  },
};
