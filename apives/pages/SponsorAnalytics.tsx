import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import {
  BarChart3,
  MousePointerClick,
  Eye,
  Download,
} from "lucide-react";

/* ================= TYPES ================= */

type SponsorStat = {
  sponsor: string;
  impressions: number;
  clicks: number;
  ctr: string;
};

type Range = "24h" | "7d" | "30d";

/* ================= PAGE ================= */

export default function SponsorAnalytics() {
  /* 🔐 ADMIN GUARD */
  const userRaw = localStorage.getItem("mora_user");
  const user = userRaw ? JSON.parse(userRaw) : null;

  if (!user || user.email !== "beatslevelone@gmail.com") {
    return <Navigate to="/" replace />;
  }

  const [data, setData] = useState<SponsorStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<Range>("7d");

  /* ================= FETCH ================= */

  useEffect(() => {
    setLoading(true);

    // future-ready: backend me range add ho sakta
    fetch("https://apives.onrender.com/api/sponsor/stats")
      .then((res) => res.json())
      .then((json) => {
        setData(json || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [range]);

  /* ================= GLOBAL METRICS ================= */

  let totalImpressions = 0;
  let totalClicks = 0;

  data.forEach((d) => {
    totalImpressions += d.impressions;
    totalClicks += d.clicks;
  });

  const avgCtr =
    totalImpressions > 0
      ? ((totalClicks / totalImpressions) * 100).toFixed(2)
      : "0.00";

  /* ================= CSV ================= */

  const downloadCSV = () => {
    const headers = ["Sponsor", "Impressions", "Clicks", "CTR"];
    const rows = data.map((d) => [
      d.sponsor,
      d.impressions,
      d.clicks,
      d.ctr,
    ]);

    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `sponsor-analytics-${range}.csv`;
    a.click();
  };

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-slate-400">
        Loading sponsor analytics…
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-black text-white px-4 md:px-12 pt-6 pb-36">
      {/* TITLE (UPPER) */}
      <div className="mb-6">
        <h1 className="text-3xl md:text-5xl font-bold mb-2">
          Sponsor Analytics
        </h1>
        <p className="text-slate-400 max-w-xl">
          Real-time sponsor performance from production database
        </p>
      </div>

      {/* RANGE FILTER – GREEN PILLS */}
      <div className="flex gap-3 mb-10">
        {(["24h", "7d", "30d"] as Range[]).map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition ${
              range === r
                ? "bg-green-500 text-black shadow-md"
                : "border border-green-500/40 text-green-400 hover:bg-green-500/10"
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        <KPI
          icon={<Eye size={18} />}
          label="Total Impressions"
          value={totalImpressions}
        />
        <KPI
          icon={<MousePointerClick size={18} />}
          label="Total Clicks"
          value={totalClicks}
        />
        <KPI
          icon={<BarChart3 size={18} />}
          label="Average CTR"
          value={`${avgCtr}%`}
          highlight
        />
      </div>

      {/* SPONSOR CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14">
        {data.map((s) => (
          <div
            key={s.sponsor}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition"
          >
            <h3 className="text-lg font-semibold mb-4 capitalize">
              {s.sponsor}
            </h3>

            <Metric label="Impressions" value={s.impressions} />
            <Metric label="Clicks" value={s.clicks} />
            <Metric label="CTR" value={`${s.ctr}%`} green />
          </div>
        ))}
      </div>

      {/* TABLE + EXPORT */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-300">
          Detailed Breakdown
        </h2>
        <button
          onClick={downloadCSV}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition"
        >
          <Download size={14} />
          Export CSV
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border border-white/10 rounded-xl overflow-hidden">
          <thead className="bg-white/10 text-slate-300 text-sm">
            <tr>
              <th className="p-4 text-left">Sponsor</th>
              <th className="p-4 text-left">Impressions</th>
              <th className="p-4 text-left">Clicks</th>
              <th className="p-4 text-left">CTR</th>
            </tr>
          </thead>
          <tbody>
            {data.map((s) => (
              <tr
                key={s.sponsor}
                className="border-t border-white/5 hover:bg-white/5 transition"
              >
                <td className="p-4 capitalize">{s.sponsor}</td>
                <td className="p-4">{s.impressions}</td>
                <td className="p-4">{s.clicks}</td>
                <td className="p-4 text-green-400 font-semibold">
                  {s.ctr}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function KPI({
  icon,
  label,
  value,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  highlight?: boolean;
}) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <div className="flex items-center gap-2 text-slate-400 mb-2">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <div
        className={`text-3xl font-bold ${
          highlight ? "text-green-400" : ""
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  green,
}: {
  label: string;
  value: number | string;
  green?: boolean;
}) {
  return (
    <div className="flex justify-between text-sm mb-3">
      <span className="text-slate-400">{label}</span>
      <span className={`font-bold ${green ? "text-green-400" : ""}`}>
        {value}
      </span>
    </div>
  );
}