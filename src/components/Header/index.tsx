import { SidebarTrigger } from "../ui/sidebar";

const Header = () => {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b pr-2">
      <SidebarTrigger />
      Header
    </header>
  );
};

export default Header;
