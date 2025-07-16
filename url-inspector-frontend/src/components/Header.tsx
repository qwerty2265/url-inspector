import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { authApi } from "../api/auth/auth-api";

export default function Header() {
  const loggedIn = useAuthStore((s) => s.loggedIn);
  const setLoggedIn = useAuthStore((s) => s.setLoggedIn);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await authApi.logout();
    setLoggedIn(false);
    navigate("/");
  };

  return (
    <header className="bg-blue-500 text-white flex items-center justify-between py-2 px-4 sm:py-4 sm:px-6 md:py-6 lg:px-8 xl:px-12 position-sticky top-0 z-50">
      <Link to="/" className="text-lg sm:text-2xl font-bold">
        URL Inspector
      </Link>
      <nav className="text-sm sm:text-base flex justify-center space-x-2 sm:space-x-4">
        {loggedIn ? (
          <button onClick={handleLogout} className="hover:underline bg-transparent border-none text-white cursor-pointer">
            Logout
          </button>
        ) : (
          <>
            <Link to="/sign-in" className="hover:underline">Sign In</Link>
            <Link to="/sign-up" className="hover:underline">Sign Up</Link>
          </>
        )}
      </nav>
    </header>
  );
}