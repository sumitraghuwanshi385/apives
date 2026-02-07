import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { ArrowLeft, BarChart3, MousePointerClick, Eye } from "lucide-react";

type SponsorStat = {
  sponsor: string;
  impressions: number;
  clicks: number;
  ctr: string;
};

export default function SponsorAnalytics() {
  const navigate = useNavigate();

  // 🔐 ADMIN GUARD
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-slate-400">
        Loading sponsor analytics...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-4 md:px-10 py-8">
      {/* 🔙 HEADER */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition"
        >
          <ArrowLeft size={18} />
          Back
        </button>
      </div>

      <h1 className="text-2xl md:text-4xl font-bold mb-2">
        Sponsor Analytics
      </h1>
      <p className="text-slate-400 mb-8">
        Real-time sponsor performance from database
      </p>

      {/* 📊 CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {data.map((s) => (
          <div
            key={s.sponsor}
            className="bg-white/5 border border-white/10 rounded-2xl p-6"
          >
            <h3 className="text-lg font-semibold mb-4 capitalize">
              {s.sponsor}
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-400">
                  <Eye size={14} /> Impressions
                </span>
                <span className="font-bold">{s.impressions}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-400">
                  <MousePointerClick size={14} /> Clicks
                </span>
                <span className="font-bold">{s.clicks}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-400">
                  <BarChart3 size={14} /> CTR
                </span>
                <span className="font-bold text-green-400">
                  {s.ctr}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 📋 TABLE */}
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