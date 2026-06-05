import { Suspense } from "react";
import { Route, Routes } from "react-router";

import { AuthProvider } from "./auth/AuthContext";
import { AuthGate } from "./auth/AuthGate";
import { useAuth } from "./auth/useAuth";
import Loading from "./components/Loading";
import { TooltipProvider } from "./components/ui/tooltip";
import MainLayout from "./layouts/MainLayout";
import routes from "./pages/routes";
import { SocketProvider } from "./realtime/SocketContext";

function AuthenticatedApp() {
  const { session } = useAuth();

  return (
    <SocketProvider token={session?.access_token}>
      <TooltipProvider>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route element={<MainLayout />}>
              {routes.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={<route.component />}
                />
              ))}
            </Route>
          </Routes>
        </Suspense>
      </TooltipProvider>
    </SocketProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AuthGate>
        <AuthenticatedApp />
      </AuthGate>
    </AuthProvider>
  );
}

export default App;
