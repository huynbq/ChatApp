import type { Chat, ChatMember } from "@/types/types";

export const getChatMemberLabel = (member: ChatMember | undefined) =>
  member?.user.displayName || member?.user.username || member?.user.email || "User";

export const getChatTitle = (
  chat: Chat | undefined,
  currentUserId: string | undefined,
) => {
  if (!chat) {
    return "Chat";
  }

  if (chat.type === "GROUP") {
    return chat.name || "Group chat";
  }

  const otherMember = chat.members.find(
    (member) => member.userId !== currentUserId,
  );

  return getChatMemberLabel(otherMember);
};
