import { Suspense } from "react";
import { Route, Routes } from "react-router";

import { AuthProvider } from "./auth/AuthContext";
import { AuthGate } from "./auth/AuthGate";
import Loading from "./components/Loading";
import MainLayout from "./layouts/MainLayout";
import routes from "./pages/routes";
function App() {
  return (
    <AuthProvider>
      <AuthGate>
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
      </AuthGate>
    </AuthProvider>
  );
}

export default App;
