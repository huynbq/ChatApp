export type Message = {
  attachments?: MessageAttachment[];
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

export type MessageAttachment = {
  bucket: string;
  createdAt?: string;
  id: string;
  messageId: string;
  mimeType: string;
  path: string;
  sizeBytes: number;
};

export type CreateMessageInput = {
  chatId: string;
  content: string;
  mentionUserIds?: string[];
  replyToMessageId?: string;
};

export type CreatePhotoMessageInput = {
  chatId: string;
  content?: string;
  file: File;
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
