import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { urlApi } from "../api/url/url-api";
import UrlInput from "../components/UrlInput";
import UrlHistoryTable from "../components/UrlHistoryTable";
import { useUrlStore } from "../store/urlStore";

export default function HomePage() {
  const loggedIn = useAuthStore(s => s.loggedIn);
  const urls = useUrlStore(s => s.urls);
  const setUrls = useUrlStore(s => s.setUrls);

  useEffect(() => {
    let interval:  ReturnType<typeof setInterval>;

    if (loggedIn) {
      getUrls();
      interval = setInterval(getUrls, 2000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [loggedIn]);

  async function getUrls() {
    const { response, data } = await urlApi.getAllUrls();
    if (!response.ok) {
      console.error("Failed to fetch URLs", data);
      return;
    }
    setUrls(data.data || []);
  }

  async function handleBulkDelete(ids: number[]) {
    for (const id of ids) {
      try {
        await urlApi.deleteUrl(id);
      } catch (e) {
        console.error(`Failed to delete URL with id ${id}`, e);
      }
    }
    await getUrls();
  }

  async function handleBulkRerun(ids: number[]) {
    for (const id of ids) {
      const urlObj = urls.find(u => u.id === id);
      if (!urlObj) continue;
      try {
        await urlApi.analyzeUrl(urlObj.url);
      } catch (e) {
        console.error(`Failed to re-run analysis for URL with id ${id}`, e);
      }
    }
    await getUrls();
  }

  async function handleStop(id: number) {
    try {
      await urlApi.stopAnalysis(id);
      await getUrls();
    } catch (e) {
      console.error(`Failed to stop analysis for URL with id ${id}`, e);
    }
  }

  async function handleResume(id: number) {
    try {
      await urlApi.resumeAnalysis(id);
      await getUrls();
    } catch (e) {
      console.error(`Failed to resume analysis for URL with id ${id}`, e);
    }
  }

  return (
    <div className="min-h-dvh pt-32 sm:pt-40">
      <section>
        <h1 className="text-xl sm:text-3xl font-bold text-gray-800 mb-2 sm:mb-4 text-center">
          Let us analyze your webpage
        </h1>
        <UrlInput />
      </section>

      {loggedIn && (
        <section className="mt-10">
        <h2 className="text-lg font-semibold mb-4 text-center">Your URL History</h2>
            <UrlHistoryTable
              urls={urls}
              onBulkDelete={handleBulkDelete}
              onBulkRerun={handleBulkRerun}
              onStop={handleStop}
              onResume={handleResume}
            />
        </section>
      )} 
    </div>
  );
}