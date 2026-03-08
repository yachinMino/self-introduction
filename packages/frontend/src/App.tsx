import type { ReactElement } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { getToken } from "./api";
import { EditPage } from "./pages/EditPage";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";

function RequireAuth({ children }: { children: ReactElement }) {
  if (!getToken()) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/edit"
        element={
          <RequireAuth>
            <EditPage />
          </RequireAuth>
        }
      />
    </Routes>
  );
}
