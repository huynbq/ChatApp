import { apiClient } from "@/api/http";
import type {
  Chat,
  CreateDirectChatInput,
  CreateGroupChatInput,
  CreateMessageInput,
  CreatePhotoMessageInput,
  DeleteMessageInput,
  EditMessageInput,
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
  createPhotoMessage: async (input: CreatePhotoMessageInput) => {
    const formData = new FormData();
    formData.append("photo", input.file);

    if (input.content?.trim()) {
      formData.append("content", input.content.trim());
    }

    if (input.replyToMessageId) {
      formData.append("replyToMessageId", input.replyToMessageId);
    }

    if (input.mentionUserIds?.length) {
      formData.append("mentionUserIds", input.mentionUserIds.join(","));
    }

    const { data } = await apiClient.post<Message>(
      `/chats/${input.chatId}/messages/photo`,
      formData,
    );

    return data;
  },
  deleteMessage: async (input: DeleteMessageInput) => {
    const { data } = await apiClient.delete<Message>(
      `/messages/${input.messageId}`,
    );

    return data;
  },
  editMessage: async (input: EditMessageInput) => {
    const { data } = await apiClient.patch<Message>(
      `/messages/${input.messageId}`,
      { content: input.content },
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
  markChatRead: async (chatId: string) => {
    const { data } = await apiClient.post(`/chats/${chatId}/read`);
    return data;
  },
};
