import { useAuth } from "@/auth/useAuth";
import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { useChatsQuery } from "@/hooks/queries/useChatQueries";
import CreateChatButton from "./CreateChatButton";
import { SidebarChatItem } from "./SidebarChatItem";

export function AppSidebar() {
  const { user } = useAuth();
  const { data: chats } = useChatsQuery();

  return (
    <Sidebar>
      <SidebarContent className="pt-4">
        <div className="space-y-2 px-4">
          <CreateChatButton />
          <div className="space-y-1">
            {chats?.map((chat) => (
              <SidebarChatItem
                key={chat.id}
                chat={chat}
                currentUserId={user?.id}
              />
            ))}
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
