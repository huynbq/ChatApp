import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import { chatApi } from "@/api/chatApi";
import { queryKeys } from "@/constants/queryKeys";
import { useSocket } from "@/realtime/useSocket";
import type {
  Chat,
  ChatReadPayload,
  CreateChatInput,
  CreateMessageInput,
  CreatePhotoMessageInput,
  DeleteMessageInput,
  EditMessageInput,
  Message,
} from "@/types/types";

const moveChatWithMessageToTop = (
  chats: Chat[] = [],
  message: Message,
  options: { incrementUnread?: boolean } = {},
) => {
  const chat = chats.find((item) => item.id === message.chatId);

  if (!chat) {
    return chats;
  }

  const updatedChat: Chat = {
    ...chat,
    messages: [message],
    updatedAt: message.createdAt,
    unreadCount: options.incrementUnread
      ? (chat.unreadCount ?? 0) + 1
      : (chat.unreadCount ?? 0),
  };

  return [updatedChat, ...chats.filter((item) => item.id !== message.chatId)];
};

const clearChatUnread = (chats: Chat[] = [], chatId: string) =>
  chats.map((chat) =>
    chat.id === chatId ? { ...chat, unreadCount: 0 } : chat,
  );

const upsertMessage = (messages: Message[] = [], message: Message) => {
  if (messages.some((item) => item.id === message.id)) {
    return messages.map((item) => (item.id === message.id ? message : item));
  }

  return [...messages, message];
};

const upsertChatToTop = (chats: Chat[] = [], chat: Chat) => {
  const existing = chats.find((item) => item.id === chat.id);

  return [
    { ...chat, unreadCount: existing?.unreadCount ?? chat.unreadCount ?? 0 },
    ...chats.filter((item) => item.id !== chat.id),
  ];
};

export const useMessagesQuery = (chatId: string | undefined) =>
  useQuery({
    enabled: Boolean(chatId),
    queryFn: () => chatApi.getMessages(chatId!),
    queryKey: queryKeys.chat.messages(chatId),
  });

export const useSendMessageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateMessageInput) => chatApi.createMessage(input),
    onSuccess: (message, input) => {
      queryClient.setQueryData<Message[]>(
        queryKeys.chat.messages(input.chatId),
        (current = []) => upsertMessage(current, message),
      );

      queryClient.setQueryData<Chat[]>(queryKeys.chat.all, (current = []) =>
        moveChatWithMessageToTop(current, message),
      );

    },
  });
};

export const useSendPhotoMessageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreatePhotoMessageInput) =>
      chatApi.createPhotoMessage(input),
    onSuccess: (message, input) => {
      queryClient.setQueryData<Message[]>(
        queryKeys.chat.messages(input.chatId),
        (current = []) => upsertMessage(current, message),
      );

      queryClient.setQueryData<Chat[]>(queryKeys.chat.all, (current = []) =>
        moveChatWithMessageToTop(current, message),
      );

    },
  });
};

export const useEditMessageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: EditMessageInput) => chatApi.editMessage(input),
    onSuccess: (message, input) => {
      queryClient.setQueryData<Message[]>(
        queryKeys.chat.messages(input.chatId),
        (current = []) => upsertMessage(current, message),
      );

      queryClient.setQueryData<Chat[]>(queryKeys.chat.all, (current = []) =>
        moveChatWithMessageToTop(current, message),
      );
    },
  });
};

export const useDeleteMessageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: DeleteMessageInput) => chatApi.deleteMessage(input),
    onSuccess: (message, input) => {
      queryClient.setQueryData<Message[]>(
        queryKeys.chat.messages(input.chatId),
        (current = []) => upsertMessage(current, message),
      );

      queryClient.setQueryData<Chat[]>(queryKeys.chat.all, (current = []) =>
        moveChatWithMessageToTop(current, message),
      );
    },
  });
};

export const useCreateChatMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateChatInput) => {
      if ("memberIds" in input) {
        return chatApi.createGroupChat(input);
      }

      return chatApi.createDirectChat(input);
    },
    onSuccess: (chat) => {
      queryClient.setQueryData<Chat[]>(queryKeys.chat.all, (current = []) =>
        upsertChatToTop(current, chat),
      );
    },
  });
};

export const useMarkChatReadMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (chatId: string) => chatApi.markChatRead(chatId),
    onSuccess: (_payload, chatId) => {
      queryClient.setQueryData<Chat[]>(queryKeys.chat.all, (current = []) =>
        clearChatUnread(current, chatId),
      );
    },
  });
};

export const useMessagesRealtime = (chatId: string | undefined) => {
  const queryClient = useQueryClient();
  const socket = useSocket();

  useEffect(() => {
    if (!chatId || !socket) {
      return;
    }

    const handleMessageUpdate = (message: Message) => {
      queryClient.setQueryData<Message[]>(
        queryKeys.chat.messages(chatId),
        (current = []) => upsertMessage(current, message),
      );

      queryClient.setQueryData<Chat[]>(queryKeys.chat.all, (current = []) =>
        moveChatWithMessageToTop(current, message),
      );
    };

    const joinChat = () => socket.emit("chat.join", { chatId });

    if (socket.connected) {
      joinChat();
    }

    socket.on("connect", joinChat);
    socket.on("message.created", handleMessageUpdate);
    socket.on("message.edited", handleMessageUpdate);
    socket.on("message.deleted", handleMessageUpdate);

    return () => {
      socket.off("connect", joinChat);
      socket.off("message.created", handleMessageUpdate);
      socket.off("message.edited", handleMessageUpdate);
      socket.off("message.deleted", handleMessageUpdate);
      socket.emit("chat.leave", { chatId });
    };
  }, [chatId, queryClient, socket]);
};

export const useChatListRealtime = (
  activeChatId: string | undefined,
  currentUserId: string | undefined,
) => {
  const queryClient = useQueryClient();
  const socket = useSocket();

  useEffect(() => {
    if (!socket) {
      return;
    }

    const handleMessageCreated = (message: Message) => {
      const chats = queryClient.getQueryData<Chat[]>(queryKeys.chat.all);

      if (!chats?.some((chat) => chat.id === message.chatId)) {
        void queryClient.invalidateQueries({ queryKey: queryKeys.chat.all });
        return;
      }

      const shouldIncrementUnread =
        message.chatId !== activeChatId && message.sender?.id !== currentUserId;

      queryClient.setQueryData<Chat[]>(
        queryKeys.chat.all,
        (current = []) =>
          moveChatWithMessageToTop(current, message, {
            incrementUnread: shouldIncrementUnread,
          }),
      );
    };

    const handleChatCreated = (chat: Chat) => {
      queryClient.setQueryData<Chat[]>(queryKeys.chat.all, (current = []) =>
        upsertChatToTop(current, chat),
      );
    };

    const handleChatRead = (payload: ChatReadPayload) => {
      if (payload.userId !== currentUserId) {
        return;
      }

      queryClient.setQueryData<Chat[]>(queryKeys.chat.all, (current = []) =>
        clearChatUnread(current, payload.chatId),
      );
    };

    socket.on("chat.created", handleChatCreated);
    socket.on("chat.message_created", handleMessageCreated);
    socket.on("chat.read", handleChatRead);

    return () => {
      socket.off("chat.created", handleChatCreated);
      socket.off("chat.message_created", handleMessageCreated);
      socket.off("chat.read", handleChatRead);
    };
  }, [activeChatId, currentUserId, queryClient, socket]);
};

export const useChatsQuery = () =>
  useQuery({
    queryFn: () => chatApi.getChats(),
    queryKey: queryKeys.chat.all,
  });
