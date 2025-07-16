import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../api/auth/auth-api";
import { useAuthStore } from "../store/authStore";

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setLoggedIn = useAuthStore((state) => state.setLoggedIn);

  const formIsValid = () => {
    return email.trim() !== "" && password.trim() !== "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { response, data } = await authApi.login(email, password);
      if (response.ok) {
        setLoggedIn(true);
        navigate("/");
      } else {
        setError(data?.message || "Login failed");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-6 rounded-lg md:shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-center">Sign In</h1>
      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          id="email"
          placeholder="Enter your email"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={handleEmailChange}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <input
          type="password"
          id="password"
          placeholder="Enter your password"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={handlePasswordChange}
        />
      </div>
      {error && <div className="mb-2 text-red-600 text-sm">{error}</div>}
      <button
        type="submit"
        className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-500"
        disabled={loading || !formIsValid()}
      >
        {loading ? "Signing In..." : "Sign In"}
      </button>
      <p className="mt-4 text-sm text-gray-600">
        Don't have an account? <Link to="/sign-up" className="text-blue-500 hover:underline">Sign Up</Link>
      </p>
    </form>
  )
}