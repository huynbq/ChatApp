import { Button } from "@/components/ui/button";
import {
  ChatContainerContent,
  ChatContainerRoot,
} from "@/components/ui/chat-container";
import {
  Message,
  MessageAction,
  MessageActions,
  MessageAvatar,
  MessageContent,
} from "@/components/ui/message";
import {
  PromptInput,
  PromptInputAction,
  PromptInputActions,
  PromptInputTextarea,
} from "@/components/ui/prompt-input";
import { ScrollButton } from "@/components/ui/scroll-button";
import { useAuth } from "@/auth/useAuth";
import {
  useMessagesQuery,
  useMessagesRealtime,
  useSendMessageMutation,
} from "@/hooks/queries/useChatQueries";
import { cn } from "@/lib/utils";
import { ArrowUp, Pencil, Plus, Trash } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";

const getSenderName = (sender: {
  displayName?: string | null;
  email?: string | null;
  username?: string | null;
}) => sender.displayName || sender.username || sender.email || "User";

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const ChatPage = () => {
  const { user } = useAuth();
  const { chatId } = useParams();
  const [prompt, setPrompt] = useState("");
  const { data: chatMessages = [], isLoading } = useMessagesQuery(chatId);
  const sendMessage = useSendMessageMutation();
  useMessagesRealtime(chatId);

  const handleSubmit = () => {
    const content = prompt.trim();
    setPrompt("");
    if (!chatId || !content) return;

    sendMessage.mutate({ chatId, content });
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
            {chatMessages.map((message) => {
              const isCurrentUser = message.sender?.id === user?.id;
              const senderName = message.sender
                ? getSenderName(message.sender)
                : "User";
              const senderFallback = getInitials(senderName);

              return (
                <Message
                  key={message.id}
                  className={cn(
                    "mx-auto flex w-full max-w-3xl min-w-0 flex-col gap-2 px-6",
                    isCurrentUser ? "items-end" : "items-start",
                  )}
                >
                  {!isCurrentUser ? (
                    <div className="group flex w-full min-w-0 gap-2">
                      <MessageAvatar
                        src={message.sender?.avatarUrl}
                        alt={senderName}
                        fallback={senderFallback}
                      />
                      <MessageContent className="text-foreground prose flex-1 max-w-fit">
                        {message.content || "Attachment"}
                      </MessageContent>
                    </div>
                  ) : (
                    <div className="group flex w-full min-w-0 justify-start flex-row-reverse gap-1">
                      <MessageAvatar
                        src={message.sender?.avatarUrl}
                        alt={senderName}
                        fallback={senderFallback}
                      />
                      <div className="flex flex-col min-w-0">
                        <MessageContent className="bg-blue-600 text-blue-50">
                          {message.content || "Attachment"}
                        </MessageContent>
                        <MessageActions
                          className={cn(
                            "flex gap-0 opacity-0 transition-opacity duration-150 group-hover:opacity-100",
                          )}
                        >
                          <MessageAction tooltip="Edit" delayDuration={100}>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="rounded-full"
                            >
                              <Pencil />
                            </Button>
                          </MessageAction>
                          <MessageAction tooltip="Delete" delayDuration={100}>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="rounded-full"
                            >
                              <Trash />
                            </Button>
                          </MessageAction>
                        </MessageActions>
                      </div>
                    </div>
                  )}
                </Message>
              );
            })}
          </ChatContainerContent>
          <div className="absolute bottom-4 left-1/2 flex w-full max-w-3xl -translate-x-1/2 justify-end px-5">
            <ScrollButton className="shadow-sm" />
          </div>
        </ChatContainerRoot>
      </div>

      <div className="bg-background z-10 shrink-0 px-3 pb-3 md:px-5 md:pb-5">
        <div className="mx-auto max-w-3xl">
          <PromptInput
            isLoading={sendMessage.isPending}
            value={prompt}
            onValueChange={setPrompt}
            onSubmit={handleSubmit}
            className="border-input bg-popover relative z-10 w-full rounded-3xl border p-0 pt-1 shadow-xs"
          >
            <div className="flex flex-col">
              <PromptInputTextarea
                placeholder="Ask anything"
                className="min-h-11 pt-3 pl-4 text-base leading-[1.3] sm:text-base md:text-base"
              />

              <PromptInputActions className="mt-5 flex w-full items-center justify-between gap-2 px-3 pb-3">
                <div className="flex items-center gap-2">
                  <PromptInputAction tooltip="Add an attachment">
                    <Button
                      variant="outline"
                      size="icon"
                      className="size-9 rounded-full"
                    >
                      <Plus size={18} />
                    </Button>
                  </PromptInputAction>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    disabled={
                      !chatId || !prompt.trim() || sendMessage.isPending
                    }
                    onClick={handleSubmit}
                    className="size-9 rounded-full"
                  >
                    {!sendMessage.isPending ? (
                      <ArrowUp size={18} />
                    ) : (
                      <span className="size-3 rounded-xs bg-white" />
                    )}
                  </Button>
                </div>
              </PromptInputActions>
            </div>
          </PromptInput>
        </div>
      </div>
    </main>
  );
};

export default ChatPage;
