import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import { useAuthStore } from "./store/authStore";
import { useEffect, useState } from "react";
import { authApi } from "./api/auth/auth-api";

function AppContent() {
  const location = useLocation();
  const showHeader = location.pathname === "/";
  const setLoggedIn = useAuthStore((state) => state.setLoggedIn);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { response } = await authApi.checkAuth();
      if (response.ok) {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
      setAuthChecked(true);
    };
    checkAuth();
  }, [setLoggedIn]);

  if (!authChecked) {
    return null;
  }

  return (
    <>
      {showHeader && <Header />}
      <main className="mx-auto px-2 sm:px-4 md:px-6 lg:px-8 xl:px-12 py-5">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<NotFoundPage />} />
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
        </Routes>
      </main>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}