import { Outlet } from "react-router-dom";

import Header from "@/components/Header";
import { AppSidebar } from "@/components/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

const MainLayout = () => {
  return (
    <div className="h-svh overflow-hidden w-full">
      <SidebarProvider>
        <AppSidebar />
        <main className="flex h-svh flex-col w-full">
          <Header />
          <div className="min-h-0 flex-1 overflow-hidden">
            <Outlet />
          </div>
        </main>
      </SidebarProvider>
    </div>
  );
};

export default MainLayout;
