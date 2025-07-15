import { Link } from "react-router";

export default function SignUpForm() {
  return (
    <form action="" className="w-full max-w-md bg-white p-6 rounded-lg md:shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-center">Sign Up</h1>
      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
        <input
          type="text"
          id="name"
          placeholder="Enter your name"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="surname" className="block text-sm font-medium text-gray-700 mb-1">Surname</label>
        <input
          type="text"
          id="surname"
          placeholder="Enter your surname"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
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
        Sign Up
      </button>
      <p className="mt-4 text-sm text-gray-600">
        Already have an account? <Link to="/sign-in" className="text-blue-500 hover:underline">Sign In</Link>
      </p>
    </form>
  )
}