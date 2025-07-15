import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-blue-500 text-white flex items-center justify-between py-2 px-4 sm:py-4 sm:px-6 md:py-6 lg:px-8 xl:px-12 position-sticky top-0 z-50">
      <Link to="/" className="text-lg sm:text-2xl font-bold">
        URL Inspector
      </Link>
      <nav className="text-sm sm:text-base flex justify-center space-x-2 sm:space-x-4">
        <Link to="/sign-in" className=" hover:underline">Sign In</Link>
        <Link to="/sign-up" className=" hover:underline">Sign Up</Link>
      </nav>
    </header>
  )
}