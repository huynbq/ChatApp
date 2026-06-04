import { useAuth } from "@/auth/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Spinner } from "@/components/ui/spinner";

const Header = () => {
  const { signOut, loading, user } = useAuth();
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b pr-2">
      <SidebarTrigger />
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
