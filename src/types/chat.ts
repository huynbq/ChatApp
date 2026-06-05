import type { Message } from "./message";

export type ChatType = "DIRECT" | "GROUP";

export type ChatMember = {
  id: string;
  chatId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  lastReadAt?: string | null;
  user: {
    id: string;
    email: string;
    username?: string | null;
    displayName?: string | null;
    avatarUrl?: string | null;
    createdAt?: string;
    updatedAt?: string;
  };
};

export type Chat = {
  id: string;
  type: ChatType;
  name?: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  members: ChatMember[];
  messages: Message[];
  unreadCount?: number;
};

export type ChatReadPayload = {
  chatId: string;
  userId: string;
  lastReadAt: string;
};

export type CreateDirectChatInput = {
  userId: string;
};

export type CreateGroupChatInput = {
  name: string;
  memberIds: string[];
};

export type CreateChatInput = CreateDirectChatInput | CreateGroupChatInput;
