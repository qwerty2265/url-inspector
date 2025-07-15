import { Link } from "react-router";

export default function SignInForm() {
  return (
    <form action="" className="w-full max-w-md bg-white p-6 rounded-lg md:shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-center">Sign In</h1>
      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          id="email"
          placeholder="Enter your email"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <input
          type="password"
          id="password"
          placeholder="Enter your password"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
      >
        Sign In
      </button>
      <p className="mt-4 text-sm text-gray-600">
        Don't have an account? <Link to="/sign-up" className="text-blue-500 hover:underline">Sign Up</Link>
      </p>
    </form>
  )
}