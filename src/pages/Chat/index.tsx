import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import { useAuth } from "@/auth/useAuth";
import {
  ChatComposer,
  ChatMessageItem,
  usePendingPhoto,
} from "@/components/Chat";
import {
  ChatContainerContent,
  ChatContainerRoot,
} from "@/components/ui/chat-container";
import { ScrollButton } from "@/components/ui/scroll-button";
import {
  useDeleteMessageMutation,
  useEditMessageMutation,
  useMarkChatReadMutation,
  useMessagesQuery,
  useMessagesRealtime,
  useSendMessageMutation,
  useSendPhotoMessageMutation,
} from "@/hooks/queries/useChatQueries";

const ChatPage = () => {
  const { user } = useAuth();
  const { chatId } = useParams();
  const lastMarkedReadKeyRef = useRef<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const {
    clearPendingPhoto,
    handlePhotoSelect,
    inputRef: photoInputRef,
    pendingPhoto,
    removePendingPhoto,
  } = usePendingPhoto();
  const { data: chatMessages = [], isLoading } = useMessagesQuery(chatId);
  const sendMessage = useSendMessageMutation();
  const sendPhotoMessage = useSendPhotoMessageMutation();
  const editMessage = useEditMessageMutation();
  const deleteMessage = useDeleteMessageMutation();
  const markChatRead = useMarkChatReadMutation();
  useMessagesRealtime(chatId);

  useEffect(() => {
    if (!chatId) {
      return;
    }

    const latestMessage = chatMessages.at(-1);
    const readKey = `${chatId}:${latestMessage?.id ?? "open"}`;

    if (lastMarkedReadKeyRef.current === readKey) {
      return;
    }

    if (latestMessage?.sender?.id === user?.id) {
      return;
    }

    lastMarkedReadKeyRef.current = readKey;
    markChatRead.mutate(chatId);
  }, [chatId, chatMessages, markChatRead, user?.id]);

  const handleSubmit = () => {
    const content = prompt.trim();
    setPrompt("");

    if (!chatId || (!content && !pendingPhoto)) return;

    if (pendingPhoto) {
      const photo = pendingPhoto;
      sendPhotoMessage.mutate({
        chatId,
        content: content || undefined,
        file: photo.file,
      });
      clearPendingPhoto();
    } else {
      sendMessage.mutate({ chatId, content });
    }
  };

  const startEditing = (messageId: string, content: string | null) => {
    setEditingMessageId(messageId);
    setEditContent(content ?? "");
  };

  const cancelEditing = () => {
    setEditingMessageId(null);
    setEditContent("");
  };

  const saveEdit = () => {
    const content = editContent.trim();
    if (!chatId || !editingMessageId || !content) return;

    editMessage.mutate(
      { chatId, content, messageId: editingMessageId },
      { onSuccess: cancelEditing },
    );
  };

  const handleDelete = (messageId: string) => {
    if (!chatId) return;

    deleteMessage.mutate({ chatId, messageId });
  };

  return (
    <main className="flex h-full min-h-0 flex-col">
      <div className="relative min-h-0 flex-1">
        <ChatContainerRoot className="h-full">
          <ChatContainerContent className="space-y-2 px-5 py-12 pb-6">
            {!chatId ? (
              <div className="text-muted-foreground mx-auto flex min-h-80 max-w-3xl items-center justify-center text-sm">
                Select a chat from the sidebar.
              </div>
            ) : null}
            {chatId && isLoading ? (
              <div className="text-muted-foreground mx-auto flex min-h-80 max-w-3xl items-center justify-center text-sm">
                Loading messages...
              </div>
            ) : null}
            {chatId && !isLoading && chatMessages.length === 0 ? (
              <div className="text-muted-foreground mx-auto flex min-h-80 max-w-3xl items-center justify-center text-sm">
                No messages yet. Start the conversation.
              </div>
            ) : null}
            {chatMessages.map((message) => (
              <ChatMessageItem
                key={message.id}
                canDelete={deleteMessage.isPending}
                canEdit={editMessage.isPending}
                currentUserId={user?.id}
                editContent={editContent}
                editingMessageId={editingMessageId}
                message={message}
                onCancelEditing={cancelEditing}
                onDelete={handleDelete}
                onEditContentChange={setEditContent}
                onSaveEdit={saveEdit}
                onStartEditing={startEditing}
              />
            ))}
          </ChatContainerContent>
          <div className="absolute bottom-4 left-1/2 flex w-full max-w-3xl -translate-x-1/2 justify-end px-5">
            <ScrollButton className="shadow-sm" />
          </div>
        </ChatContainerRoot>
      </div>

      <div className="bg-background z-10 shrink-0 px-3 pb-3 md:px-5 md:pb-5">
        <div className="mx-auto max-w-3xl">
          <ChatComposer
            disabled={!chatId}
            isLoading={sendMessage.isPending || sendPhotoMessage.isPending}
            onPhotoSelect={handlePhotoSelect}
            onRemovePhoto={removePendingPhoto}
            onSubmit={handleSubmit}
            pendingPhoto={pendingPhoto}
            photoInputRef={photoInputRef}
            prompt={prompt}
            setPrompt={setPrompt}
          />
        </div>
      </div>
    </main>
  );
};

export default ChatPage;
