import { useState } from "react";
import Spinner from "./Spinner";
import { twMerge } from "tailwind-merge";
import { urlApi } from "../api/url/url-api";

export default function UrlInput() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { response, data } = await urlApi.analyzeUrl(url);
      if (response.ok) {
        alert("URL submitted successfully!");
      } else {
        setError(data?.message || "Failed to submit URL");
      }
      setUrl("");
    } catch (err) {
      setError("Failed to submit URL");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <div className="flex gap-2 sm:gap-4">
      <div 
        className={twMerge(
          "relative w-full border-2 px-4 py-2 rounded-lg border-blue-400 focus-within:bg-gray-50",
          loading && "bg cursor-not-allowed bg-gray-50"
        )}
      >
        <Spinner 
          className={twMerge(
            "absolute left-1/2 right-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
            loading ? "block" : "hidden",
          )}
        />
        <input
          type="text"
          placeholder="https://example.com"
          className="w-full bg-transparent outline-none text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          value={url}
          onChange={handleUrlChange}
          disabled={loading}
        />
      </div>
      <button
        className="bg-orange-400 px-5 sm:px-10 py-2 rounded-lg text-white cursor-pointer hover:bg-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-orange-400"
        onClick={handleSubmit}
        disabled={loading || !url.trim()}
      >
        Submit
      </button>
    </div>
    {error && <div className="mb-2 text-red-600 text-sm">{error}</div>}
    </>
  );
}