import type { Session, User } from "@supabase/supabase-js";

export type Message = {
  content: string | null;
  createdAt: string;
  deletedAt?: string | null;
  editedAt?: string | null;
  id: string;
  isDeleted?: boolean;
  sender?: {
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

export type AuthCredentials = {
  email: string;
  password: string;
};

export type SupabaseAuthResponse = Partial<Session> & {
  session?: Session | null;
  user?: User | null;
};
