import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { urlApi } from "../api/url/url-api";
import type { Url } from "../api/url/url-types";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const PIE_COLORS = ["#2563eb", "#f59e42"];

function isValidUrlData(data: any): data is Url {
  return data && typeof data === "object" && "id" in data && "url" in data;
}

export default function UrlStatsPage() {
  const { id } = useParams<{ id: string }>();
  const [urlData, setUrlData] = useState<Url | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    async function fetchUrl() {
      if (!id) return;
      const { response, data } = await urlApi.getUrlById(Number(id));
      if (response.ok && isValidUrlData(data.data)) {
        setUrlData(data.data as Url);
      } else {
        setUrlData(null);
      }
      setLoading(false);
    }

    fetchUrl();
    interval = setInterval(fetchUrl, 2000);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [id]);

  const pieData = useMemo(
    () => [
      { name: "Internal", value: urlData?.internal_links_count || 0 },
      { name: "External", value: urlData?.external_links_count || 0 },
    ],
    [urlData?.internal_links_count, urlData?.external_links_count]
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 bg-gray-100">
        <span className="text-gray-500 text-lg">Loading...</span>
      </div>
    );
  }

  if (!urlData) {
    return (
      <div className="flex justify-center items-center h-64 bg-gray-100">
        <span className="text-gray-500 text-lg">URL not found</span>
      </div>
    );
  }




  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl md:shadow-lg p-6 mt-8">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <span>URL Statistics</span>
        <span className="text-base text-gray-400 font-normal">id: {urlData.id}</span>
      </h1>

      <div className="mb-6">
        <div className="mb-2">
          <span className="font-semibold text-gray-700">URL: </span>
          <a
            href={urlData.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline break-all"
          >
            {urlData.url}
          </a>
        </div>
        <div className="mb-2">
          <span className="font-semibold text-gray-700">Status: </span>
          <span
            className={
              urlData.status === "done"
                ? "text-green-600 font-semibold"
                : urlData.status === "error"
                ? "text-red-600 font-semibold"
                : urlData.status === "running"
                ? "text-yellow-600 font-semibold"
                : urlData.status === "queued"
                ? "text-blue-600 font-semibold"
                : urlData.status === "stopped"
                ? "text-gray-400 font-semibold"
                : "text-gray-700"
            }
          >
            {urlData.status}
          </span>
        </div>
        <div className="mb-2">
          <span className="font-semibold text-gray-700">Title: </span>
          <span>{urlData.page_title || <span className="text-gray-400">—</span>}</span>
        </div>
        <div className="mb-2">
          <span className="font-semibold text-gray-700">HTML Version: </span>
          <span>{urlData.html_version || <span className="text-gray-400">—</span>}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-gray-50 rounded-lg p-4 flex flex-col items-center">
          <h2 className="text-lg font-semibold mb-4">Headings</h2>
          <div className="flex flex-wrap gap-4 justify-center">
            <StatBox label="H1" value={urlData.h1_count} />
            <StatBox label="H2" value={urlData.h2_count} />
            <StatBox label="H3" value={urlData.h3_count} />
            <StatBox label="H4" value={urlData.h4_count} />
            <StatBox label="H5" value={urlData.h5_count} />
            <StatBox label="H6" value={urlData.h6_count} />
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 flex flex-col items-center">
          <h2 className="text-lg font-semibold mb-4">Links</h2>
          <div className="flex flex-wrap gap-4 justify-center">
            <StatBox label="Internal" value={urlData.internal_links_count} />
            <StatBox label="External" value={urlData.external_links_count} />
            <StatBox label="Broken" value={urlData.broken_links_count} />
          </div>
        </div>
      </div>

      <div className="mb-10">
        <h2 className="text-lg font-semibold mb-4">Chart: Internal vs External Links</h2>
        <div className="w-full h-96 bg-gray-50 rounded-lg flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, percent }) =>
                  `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`
                }
                isAnimationActive={false}
              >
                {PIE_COLORS.map((color) => (
                  <Cell key={color} fill={color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4 text-blue-700">Broken Links</h2>
        {urlData.broken_links_list && urlData.broken_links_list.length > 0 ? (
          <ul className="bg-gray-200 p-4 text-sm space-y-2 overflow-x-auto whitespace-nowrap">
            {urlData.broken_links_list.map((bl, idx) => (
              <li key={idx} className="flex flex-row gap-2">
                <span className="font-mono">{bl.url}</span>
                <span className="ml-2 text-red-600">{bl.status}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-gray-400">No broken links</div>
        )}
      </div>
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col items-center bg-white rounded shadow px-4 py-2 min-w-[60px]">
      <span className="text-xs text-gray-500">{label}</span>
      <span className="text-lg font-bold text-blue-800">{value}</span>
    </div>
  );
}