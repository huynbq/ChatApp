import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { io, type Socket } from "socket.io-client";

import { chatApi } from "@/api/chatApi";
import { API_ORIGIN } from "@/constants/api";
import { queryKeys } from "@/constants/queryKeys";
import { supabase } from "@/lib/supabase";
import type { Chat, CreateChatInput, CreateMessageInput, Message } from "@/types/types";

const moveChatWithMessageToTop = (chats: Chat[] = [], message: Message) => {
  const chat = chats.find((item) => item.id === message.chatId);

  if (!chat) {
    return chats;
  }

  const updatedChat: Chat = {
    ...chat,
    messages: [message],
    updatedAt: message.createdAt,
  };

  return [updatedChat, ...chats.filter((item) => item.id !== message.chatId)];
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
        (current = []) => {
          if (current.some((item) => item.id === message.id)) {
            return current.map((item) =>
              item.id === message.id ? message : item,
            );
          }

          return [...current, message];
        },
      );

      queryClient.setQueryData<Chat[]>(queryKeys.chat.all, (current = []) =>
        moveChatWithMessageToTop(current, message),
      );

      void queryClient.invalidateQueries({
        queryKey: queryKeys.chat.all,
      });
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
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.chat.all });
    },
  });
};

export const useMessagesRealtime = (chatId: string | undefined) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!chatId) {
      return;
    }

    let isActive = true;
    let socket: Socket | undefined;

    const upsertMessage = (message: Message) => {
      queryClient.setQueryData<Message[]>(
        queryKeys.chat.messages(chatId),
        (current = []) => {
          const index = current.findIndex((item) => item.id === message.id);

          if (index === -1) {
            return [...current, message];
          }

          return current.map((item) =>
            item.id === message.id ? message : item,
          );
        },
      );

      queryClient.setQueryData<Chat[]>(queryKeys.chat.all, (current = []) =>
        moveChatWithMessageToTop(current, message),
      );
    };

    void supabase.auth.getSession().then(({ data }) => {
      if (!isActive || !data.session?.access_token) {
        return;
      }

      socket = io(API_ORIGIN, {
        auth: {
          token: data.session.access_token,
        },
        transports: ["websocket"],
      });

      socket.on("connect", () => {
        socket?.emit("chat.join", { chatId });
      });
      socket.on("message.created", upsertMessage);
      socket.on("message.edited", upsertMessage);
      socket.on("message.deleted", upsertMessage);
    });

    return () => {
      isActive = false;
      socket?.emit("chat.leave", { chatId });
      socket?.disconnect();
    };
  }, [chatId, queryClient]);
};

export const useChatListRealtime = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    let isActive = true;
    let socket: Socket | undefined;

    const handleMessageCreated = (message: Message) => {
      const chats = queryClient.getQueryData<Chat[]>(queryKeys.chat.all);

      if (!chats?.some((chat) => chat.id === message.chatId)) {
        void queryClient.invalidateQueries({ queryKey: queryKeys.chat.all });
        return;
      }

      queryClient.setQueryData<Chat[]>(queryKeys.chat.all, (current = []) =>
        moveChatWithMessageToTop(current, message),
      );
    };

    void supabase.auth.getSession().then(({ data }) => {
      if (!isActive || !data.session?.access_token) {
        return;
      }

      socket = io(API_ORIGIN, {
        auth: {
          token: data.session.access_token,
        },
        transports: ["websocket"],
      });

      socket.on("chat.message_created", handleMessageCreated);
    });

    return () => {
      isActive = false;
      socket?.disconnect();
    };
  }, [queryClient]);
};

export const useChatsQuery = () =>
  useQuery({
    queryFn: () => chatApi.getChats(),
    queryKey: queryKeys.chat.all,
  });
