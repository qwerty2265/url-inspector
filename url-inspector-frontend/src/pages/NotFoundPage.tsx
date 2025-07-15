export default function NotFoundPage() { 
  return (
    <div className="min-h-dvh flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-700">404 - Page Not Found</h1>
        <p className="mt-4 text-gray-500">
          The page you are looking for does not exist.
        </p>
        <a href="/" className="mt-6 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Go to Home
        </a>
      </div>
    </div>
  )
}