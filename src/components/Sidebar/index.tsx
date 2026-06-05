import { useAuth } from "@/auth/useAuth";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { useChatListRealtime, useChatsQuery } from "@/hooks/queries/useChatQueries";
import { useNavigate, useParams } from "react-router-dom";
import CreateChatButton from "./CreateChatButton";
import { SidebarChatItem, SidebarChatItemSkeleton } from "./SidebarChatItem";

export function AppSidebar() {
  const { user } = useAuth();
  const { data: chats, isLoading } = useChatsQuery();
  const navigate = useNavigate();
  const { chatId } = useParams();

  useChatListRealtime(chatId, user?.id);

  return (
    <Sidebar>
      <SidebarHeader className="flex flex-row items-center justify-between">
        <CreateChatButton />
      </SidebarHeader>
      <SidebarContent>
        <div className="space-y-2 px-4">
          <div className="space-y-1">
            {isLoading
              ? Array.from({ length: 6 }).map((_, index) => (
                  <SidebarChatItemSkeleton key={index} />
                ))
              : null}
            {chats?.map((chat) => (
              <SidebarChatItem
                key={chat.id}
                chat={chat}
                currentUserId={user?.id}
                isActive={chat.id === chatId}
                onClick={() => navigate(`/chats/${chat.id}`)}
              />
            ))}
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
