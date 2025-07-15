export default function UrlInput() {
  return (
    <div className="flex gap-2 sm:gap-4">
      <div className="w-full border-2 px-4 py-2 rounded-lg border-blue-400 focus-within:bg-gray-50">
        <input
          type="text"
          placeholder="https://example.com"
          className="w-full bg-transparent outline-none text-lg"
        />
      </div>
      <button className="bg-orange-400 px-5 sm:px-10 py-2 rounded-lg text-white cursor-pointer hover:bg-orange-500 transition-colors">
        Submit
      </button>
    </div>
  );
}