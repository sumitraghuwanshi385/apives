import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BarChart3,
  MousePointerClick,
  Eye,
  Download,
} from "lucide-react";

type SponsorStat = {
  sponsor: string;
  impressions: number;
  clicks: number;
  ctr: string;
};

export default function SponsorAnalytics() {
  const navigate = useNavigate();

  /* 🔐 ADMIN GUARD */
  const userRaw = localStorage.getItem("mora_user");
  const user = userRaw ? JSON.parse(userRaw) : null;

  if (!user || user.email !== "beatslevelone@gmail.com") {
    return <Navigate to="/" replace />;
  }

  const [data, setData] = useState<SponsorStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://apives.onrender.com/api/sponsor/stats")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  /* 📊 GLOBAL METRICS */
  const totals = useMemo(() => {
    const impressions = data.reduce((a, b) => a + b.impressions, 0);
    const clicks = data.reduce((a, b) => a + b.clicks, 0);
    const ctr =
      impressions > 0 ? ((clicks / impressions) * 100).toFixed(2) : "0.00";

    return { impressions, clicks, ctr };
  }, [data]);

  /* ⬇️ CSV DOWNLOAD */
  const downloadCSV = () => {
    const headers = ["Sponsor", "Impressions", "Clicks", "CTR"];
    const rows = data.map((d) => [
      d.sponsor,
      d.impressions,
      d.clicks,
      d.ctr,
    ]);

    const csv =
      [headers, ...rows].map((r) => r.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "sponsor-analytics.csv";
    a.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-slate-400">
        Loading sponsor analytics…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-4 md:px-12 py-10 pb-32">
      {/* 🔙 HEADER */}
      <div className="flex items-center gap-4 mb-10 mt-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition"
        >
          <ArrowLeft size={18} />
          Back
        </button>
      </div>

      {/* 🧠 TITLE */}
      <div className="mb-10">
        <h1 className="text-3xl md:text-5xl font-bold mb-3">
          Sponsor Analytics
        </h1>
        <p className="text-slate-400 max-w-xl">
          Real-time sponsor performance insights directly from production
          database.
        </p>
      </div>

      {/* 🔢 GLOBAL KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        <KPI
          icon={<Eye size={18} />}
          label="Total Impressions"
          value={totals.impressions}
        />
        <KPI
          icon={<MousePointerClick size={18} />}
          label="Total Clicks"
          value={totals.clicks}
        />
        <KPI
          icon={<BarChart3 size={18} />}
          label="Average CTR"
          value={`${totals.ctr}%`}
          highlight
        />
      </div>

      {/* 📦 SPONSOR CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14">
        {data.map((s) => (
          <div
            key={s.sponsor}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition"
          >
            <h3 className="text-lg font-semibold mb-4 capitalize">
              {s.sponsor}
            </h3>

            <MetricRow
              icon={<Eye size={14} />}
              label="Impressions"
              value={s.impressions}
            />
            <MetricRow
              icon={<MousePointerClick size={14} />}
              label="Clicks"
              value={s.clicks}
            />
            <MetricRow
              icon={<BarChart3 size={14} />}
              label="CTR"
              value={`${s.ctr}%`}
              green
            />
          </div>
        ))}
      </div>

      {/* 📈 MINI GRAPH (visual balance) */}
      <div className="mb-14">
        <h2 className="text-lg font-semibold mb-4 text-slate-300">
          Click Distribution
        </h2>

        <div className="flex items-end gap-4 h-40">
          {data.map((s) => (
            <div key={s.sponsor} className="flex-1">
              <div
                className="bg-mora-500 rounded-t-md"
                style={{
                  height: `${Math.max(10, s.clicks * 10)}px`,
                }}
              />
              <p className="text-xs text-center mt-2 text-slate-400 capitalize">
                {s.sponsor}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 📋 TABLE + EXPORT */}
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

/* 🔹 Small Components */

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

function MetricRow({
  icon,
  label,
  value,
  green,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  green?: boolean;
}) {
  return (
    <div className="flex items-center justify-between text-sm mb-3">
      <span className="flex items-center gap-2 text-slate-400">
        {icon} {label}
      </span>
      <span className={`font-bold ${green ? "text-green-400" : ""}`}>
        {value}
      </span>
    </div>
  );
}