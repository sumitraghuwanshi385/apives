import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Globe,
  Bookmark,
  Share2,
  CheckCircle,
  Trophy
} from "lucide-react";
import { ApiListing } from "../types";

interface Props {
  api: ApiListing;
  topIds?: string[];
}

const RANK_BADGE_STYLES = [
  { label: "Apex", color: "from-amber-400 to-yellow-600", text: "text-black" },
  { label: "Prime", color: "from-slate-200 to-slate-400", text: "text-black" },
  { label: "Zenith", color: "from-orange-400 to-amber-700", text: "text-white" }
];

const isNew = (dateString?: string) => {
  if (!dateString) return false;
  const publishedDate = new Date(dateString).getTime();
  if (Number.isNaN(publishedDate)) return false;
  return Date.now() - publishedDate < 15 * 24 * 60 * 60 * 1000;
};

const LandingApiCard: React.FC<Props> = ({ api, topIds = [] }) => {
  const [saved, setSaved] = useState(false);
const [showVerifyInfo, setShowVerifyInfo] = useState(false);
const isVerified = api.verified;

  const firstImage =
    Array.isArray(api.gallery) && api.gallery.length > 0
      ? api.gallery[0]
      : null;

  const rankIndex = topIds.indexOf(api.id);
  const rankStyle = rankIndex !== -1 ? RANK_BADGE_STYLES[rankIndex] : null;

  useEffect(() => {
    const savedApis = JSON.parse(localStorage.getItem("mora_saved_apis") || "[]");
    setSaved(savedApis.includes(api.id));
  }, [api.id]);

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const savedApis = JSON.parse(localStorage.getItem("mora_saved_apis") || "[]");

    if (saved) {
      localStorage.setItem(
        "mora_saved_apis",
        JSON.stringify(savedApis.filter((id: string) => id !== api.id))
      );
      setSaved(false);
    } else {
      localStorage.setItem(
        "mora_saved_apis",
        JSON.stringify([...savedApis, api.id])
      );
      setSaved(true);
    }
  };

  return (
    <Link
      to={`/api/${api.id}`}
      className="group relative bg-dark-900/40 hover:bg-dark-900/70
      rounded-2xl border border-white/10
      p-4 transition-all duration-300 hover:-translate-y-1 flex flex-col"
    >
      {/* IMAGE */}
      {firstImage && (
        <div className="w-full aspect-[16/9] rounded-xl overflow-hidden mb-4 border border-white/10 bg-black">
          <img
            src={firstImage}
            alt={api.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* CATEGORY + PRICING + RANK */}
      <div className="flex flex-wrap items-center gap-2 mb-2">

        {/* Category */}
        <span className="text-[9px] px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 uppercase tracking-wider">
          {api.category}
        </span>

        {/* Tier Badge */}
        {rankStyle && (
          <span
            className={`text-[9px] px-3 py-1 rounded-full uppercase tracking-wider
            bg-gradient-to-r ${rankStyle.color} ${rankStyle.text}`}
          >
            {rankStyle.label}
          </span>
        )}

        {/* Pricing */}
        <span
          className={`text-[9px] px-3 py-1 rounded-full border uppercase tracking-wider
          ${
            api.pricing?.type === "Free"
              ? "bg-green-500/10 text-green-400 border-green-500/20"
              : api.pricing?.type === "Freemium"
              ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
              : api.pricing?.type === "Paid"
              ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
              : "bg-white/5 text-slate-400 border-white/10"
          }`}
        >
          {api.pricing?.type || "Unknown"}
        </span>

        {/* NEW Badge */}
        {isNew(api.createdAt) && (
          <span className="text-[9px] px-3 py-1 rounded-full bg-white text-black uppercase font-bold">
            New
          </span>
        )}
      </div>
      <h3 className="font-display font-bold text-white text-base md:text-lg leading-tight group-hover:text-mora-400 transition-colors">
        <span className="inline-flex items-center flex-wrap gap-0.5">
          {api.name}

                {isVerified && (
            <span className="relative">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowVerifyInfo(v => !v);
                }}
                className="h-5 w-5 md:h-6 md:w-6 flex items-center justify-center"
              >
                <svg viewBox="0 0 24 24" className="w-full h-full">
                  <path
                    fill="#22C55E"
                    d="M22 12c0-1.2-.8-2.3-2-2.8.4-1.2.1-2.6-.8-3.4-.9-.9-2.2-1.2-3.4-.8C15.3 3.8 14.2 3 13 3s-2.3.8-2.8 2c-1.2-.4-2.6-.1-3.4.8-.9.9-1.2 2.2-.8 3.4C4.8 9.7 4 10.8 4 12s.8 2.3 2 2.8c-.4 1.2-.1 2.6.8 3.4.9.9 2.2 1.2 3.4.8.5 1.2 1.6 2 2.8 2s2.3-.8 2.8-2c1.2.4 2.6.1 3.4-.8.9-.9 1.2-2.2.8-3.4 1.2-.5 2-1.6 2-2.8z"
                  />
                  <path
                    d="M9.2 12.3l2 2.1 4.6-4.8"
                    stroke="#000"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
              </button>

              {showVerifyInfo && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-[200] pointer-events-none">
                  <div className="relative bg-green-600 border border-green-700 rounded-full
                    px-3 py-1 text-[10px] text-white font-medium shadow-xl whitespace-nowrap">
                    <span className="absolute left-1/2 -translate-x-1/2 -top-1 w-2 h-2 bg-green-600 rotate-45 border-l border-t border-green-700" />
                    Manually verified by Apives
                  </div>
          </div>
        )}
      </span>
    )}
  </span>
</h3>

      <p className="text-[11px] text-slate-500 mt-1">
        {api.provider}
      </p>

      <p className="text-sm text-slate-400 mt-3 line-clamp-3 flex-grow">
        {api.description}
      </p>

      {/* VIEW DETAILS BUTTON */}
      <div className="mt-4">
        <span className="inline-block text-[10px] px-4 py-2 rounded-full
        bg-white/5 border border-white/10 text-white uppercase tracking-wider">
          View Details
        </span>
      </div>

      {/* BOTTOM RIGHT ICONS */}
      <div className="absolute bottom-4 right-4 flex gap-2">

        {/* SAVE */}
        <button
          onClick={handleSave}
          className={`h-8 w-8 rounded-full flex items-center justify-center border
          ${
            saved
              ? "bg-green-500 text-black border-green-500"
              : "bg-white/5 border-white/10 text-slate-400"
          }`}
        >
          <Bookmark size={14} />
        </button>

        {/* GLOBE */}
        {api.externalUrl && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              window.open(api.externalUrl, "_blank");
            }}
            className="h-8 w-8 rounded-full bg-white/5 border border-white/10 text-slate-400 flex items-center justify-center hover:bg-green-500 hover:text-black transition"
          >
            <Globe size={14} />
          </button>
        )}

        {/* SHARE */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            navigator.clipboard.writeText(window.location.origin + "/api/" + api.id);
          }}
          className="h-8 w-8 rounded-full bg-white/5 border border-white/10 text-slate-400 flex items-center justify-center hover:bg-green-500 hover:text-black transition"
        >
          <Share2 size={14} />
        </button>

      </div>
    </Link>
  );
};

export default LandingApiCard;