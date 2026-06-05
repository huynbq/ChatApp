import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getChatMemberLabel, getChatTitle } from "@/lib/chat";
import { cn } from "@/lib/utils";
import type { Chat, ChatMember } from "@/types/types";
import { Badge } from "../ui/badge";

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const getLastMessagePreview = (chat: Chat) => {
  const lastMessage = chat.messages[0];

  if (!lastMessage) {
    return "No messages yet";
  }

  if (lastMessage.deletedAt || lastMessage.isDeleted) {
    return "Message deleted";
  }

  return lastMessage.content || "Attachment";
};

const ChatAvatar = ({ member }: { member: ChatMember }) => {
  const label = getChatMemberLabel(member);

  return (
    <Avatar>
      {member.user.avatarUrl ? (
        <AvatarImage src={member.user.avatarUrl} />
      ) : null}
      <AvatarFallback>{getInitials(label)}</AvatarFallback>
    </Avatar>
  );
};

const ChatListAvatar = ({
  chat,
  currentUserId,
}: {
  chat: Chat;
  currentUserId: string | undefined;
}) => {
  const otherMembers = chat.members.filter(
    (member) => member.userId !== currentUserId,
  );
  const visibleMembers =
    chat.type === "DIRECT"
      ? otherMembers.slice(0, 1)
      : chat.members.slice(0, 2);
  const hiddenCount =
    chat.type === "GROUP" ? Math.max(chat.members.length - 2, 0) : 0;

  if (visibleMembers.length <= 1 && hiddenCount === 0) {
    const member = visibleMembers[0] || chat.members[0];

    return member ? <ChatAvatar member={member} /> : null;
  }

  return (
    <AvatarGroup>
      {visibleMembers.map((member) => (
        <ChatAvatar key={member.id} member={member} />
      ))}
      {hiddenCount > 0 ? (
        <AvatarGroupCount>+{hiddenCount}</AvatarGroupCount>
      ) : null}
    </AvatarGroup>
  );
};

export function SidebarChatItem({
  chat,
  currentUserId,
  isActive,
  onClick,
}: {
  chat: Chat;
  currentUserId: string | undefined;
  isActive?: boolean;
  onClick?: () => void;
}) {
  const unreadCount = chat.unreadCount ?? 0;

  return (
    <Button
      variant="ghost"
      className={cn(
        "h-auto w-full justify-start gap-3 px-2 py-2 text-left",
        isActive && "bg-muted text-foreground",
      )}
      onClick={onClick}
    >
      <ChatListAvatar chat={chat} currentUserId={currentUserId} />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium">
          {getChatTitle(chat, currentUserId)}
        </span>
        <span className="text-muted-foreground block truncate text-xs font-normal">
          {getLastMessagePreview(chat)}
        </span>
      </span>
      {unreadCount > 0 ? (
        <Badge variant={"destructive"}> {unreadCount > 99 ? "99+" : unreadCount}</Badge>
      ) : null}
    </Button>
  );
}

export function SidebarChatItemSkeleton() {
  return (
    <div className="flex items-center gap-3 px-2 py-2">
      <Skeleton className="size-8 shrink-0 rounded-full" />
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}
