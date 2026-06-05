import { Pencil, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Message,
  MessageAction,
  MessageActions,
  MessageAvatar,
  MessageContent,
} from "@/components/ui/message";
import { cn } from "@/lib/utils";
import type { Message as MessageType } from "@/types/types";

import { PhotoAttachmentImage } from "@/components/Chat/PhotoAttachmentImage";

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

export function ChatMessageItem({
  canDelete,
  canEdit,
  currentUserId,
  editContent,
  editingMessageId,
  message,
  onCancelEditing,
  onDelete,
  onEditContentChange,
  onSaveEdit,
  onStartEditing,
}: {
  canDelete: boolean;
  canEdit: boolean;
  currentUserId: string | undefined;
  editContent: string;
  editingMessageId: string | null;
  message: MessageType;
  onCancelEditing: () => void;
  onDelete: (messageId: string) => void;
  onEditContentChange: (content: string) => void;
  onSaveEdit: () => void;
  onStartEditing: (messageId: string, content: string | null) => void;
}) {
  const isCurrentUser = message.sender?.id === currentUserId;
  const senderName = message.sender ? getSenderName(message.sender) : "User";
  const senderFallback = getInitials(senderName);
  const isEditing = editingMessageId === message.id;
  const canModify = isCurrentUser && !message.isDeleted;
  const imageAttachments = (message.attachments ?? []).filter((attachment) =>
    attachment.mimeType.startsWith("image/"),
  );
  const hasImages = imageAttachments.length > 0;
  const shouldHideDefaultPhotoText = hasImages && message.content === "Photo";
  const messageText = message.isDeleted
    ? "Message deleted"
    : shouldHideDefaultPhotoText
      ? ""
      : message.content || (hasImages ? "" : "Attachment");

  const images =
    hasImages && !message.isDeleted ? (
      <div className="mb-2 grid max-w-80 gap-2">
        {imageAttachments.map((attachment) => (
          <PhotoAttachmentImage
            key={attachment.id}
            alt={message.content || "Photo attachment"}
            bucket={attachment.bucket}
            path={attachment.path}
          />
        ))}
      </div>
    ) : null;

  return (
    <Message
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
          <MessageContent
            className={cn(
              "text-foreground prose flex-1 max-w-fit",
              message.isDeleted && "bg-muted text-muted-foreground italic",
            )}
          >
            {images}
            {messageText ? <span>{messageText}</span> : null}
          </MessageContent>
        </div>
      ) : (
        <div className="group flex w-full min-w-0 flex-row-reverse justify-start gap-1">
          <MessageAvatar
            src={message.sender?.avatarUrl}
            alt={senderName}
            fallback={senderFallback}
          />
          <div className="flex min-w-0 flex-col">
            {isEditing ? (
              <div className="flex min-w-0 flex-col gap-2">
                <textarea
                  value={editContent}
                  onChange={(event) => onEditContentChange(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Escape") {
                      onCancelEditing();
                    }

                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      onSaveEdit();
                    }
                  }}
                  className="border-input bg-background focus-visible:ring-ring min-h-20 w-72 max-w-full resize-none rounded-2xl border px-4 py-3 text-sm outline-none focus-visible:ring-2"
                  autoFocus
                />
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={onCancelEditing}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    disabled={!editContent.trim() || canEdit}
                    onClick={onSaveEdit}
                  >
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <MessageContent
                  className={cn(
                    "bg-blue-600 text-blue-50",
                    message.isDeleted &&
                      "bg-muted text-muted-foreground italic",
                  )}
                >
                  {images}
                  {messageText ? <span>{messageText}</span> : null}
                </MessageContent>
                {message.editedAt && !message.isDeleted ? (
                  <span className="text-muted-foreground mt-1 text-right text-xs">
                    Edited
                  </span>
                ) : null}
              </>
            )}
            {canModify && !isEditing ? (
              <MessageActions className="flex justify-end gap-0 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                <MessageAction tooltip="Edit" delayDuration={100}>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Edit message"
                    className="rounded-full"
                    onClick={() => onStartEditing(message.id, message.content)}
                  >
                    <Pencil />
                  </Button>
                </MessageAction>
                <MessageAction tooltip="Delete" delayDuration={100}>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Delete message"
                    className="rounded-full"
                    disabled={canDelete}
                    onClick={() => onDelete(message.id)}
                  >
                    <Trash />
                  </Button>
                </MessageAction>
              </MessageActions>
            ) : null}
          </div>
        </div>
      )}
    </Message>
  );
}
