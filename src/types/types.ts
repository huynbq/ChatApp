import type { Session, User } from "@supabase/supabase-js";

export type Message = {
  chatId: string;
  content: string | null;
  createdAt: string;
  deletedAt?: string | null;
  editedAt?: string | null;
  id: string;
  isDeleted?: boolean;
  sender?: {
    avatarUrl?: string | null;
    displayName?: string | null;
    email?: string | null;
    id: string;
    username?: string | null;
  };
};

export type CreateMessageInput = {
  chatId: string;
  content: string;
  mentionUserIds?: string[];
  replyToMessageId?: string;
};

export type EditMessageInput = {
  chatId: string;
  content: string;
  messageId: string;
};

export type DeleteMessageInput = {
  chatId: string;
  messageId: string;
};

export type AuthCredentials = {
  email: string;
  password: string;
};

export type SupabaseAuthResponse = Partial<Session> & {
  session?: Session | null;
  user?: User | null;
};

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

export type ProfileUser = {
  id: string;
  email: string;
  username?: string | null;
  displayName?: string | null;
  avatarUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
};
