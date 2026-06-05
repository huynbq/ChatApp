import { useAuth } from "@/auth/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Spinner } from "@/components/ui/spinner";
import { useChatsQuery } from "@/hooks/queries/useChatQueries";
import { getChatTitle } from "@/lib/chat";
import { useParams } from "react-router-dom";

const Header = () => {
  const { signOut, loading, user } = useAuth();
  const { chatId } = useParams();
  const { data: chats } = useChatsQuery();
  const selectedChat = chats?.find((chat) => chat.id === chatId);
  const title = chatId ? getChatTitle(selectedChat, user?.id) : "Select a chat";

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b pr-2">
      <div className="flex min-w-0 items-center gap-2">
        <SidebarTrigger />
        <h6 className="truncate text-sm font-medium sm:text-base">{title}</h6>
      </div>
      <div className="flex gap-2">
        <div className="flex gap-2 items-center">
          <p>{user?.email}</p>
          <Avatar>
            <AvatarImage
              src={
                user?.user_metadata?.avatar_url ??
                "https://github.com/shadcn.png"
              }
            />
            <AvatarFallback>
              {user?.email?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
        <Button onClick={signOut} disabled={loading}>
          {loading ? <Spinner /> : "Sign Out"}
        </Button>
      </div>
    </header>
  );
};

export default Header;
