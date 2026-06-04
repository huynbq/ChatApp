import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="h-svh overflow-hidden">
      <div className="bg-stone-50 min-w-0">
        <div />
        <div className="bg-white rounded-xl m-2 min-h-0 overflow-hidden">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
