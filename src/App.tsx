import { Suspense } from "react";
import { Route, Routes } from "react-router";

import { AuthProvider } from "./auth/AuthContext";
import { AuthGate } from "./auth/AuthGate";
import Loading from "./components/Loading";
import routes from "./pages/routes";
import { TooltipProvider } from "./components/ui/tooltip";
import MainLayout from "./layouts/MainLayout";
function App() {
  return (
    <AuthProvider>
      <AuthGate>
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
      </AuthGate>
    </AuthProvider>
  );
}

export default App;
