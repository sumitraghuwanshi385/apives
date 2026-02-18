import React from "react";
import { Link } from "react-router-dom";
import { Globe } from "lucide-react";
import { ApiListing } from "../types";

interface Props {
  api: ApiListing;
}

const LandingApiCard: React.FC<Props> = ({ api }) => {
  const firstImage =
    Array.isArray(api.gallery) && api.gallery.length > 0
      ? api.gallery[0]
      : null;

  return (
    <Link
      to={`/api/${api.id}`}
      className="group relative bg-dark-900/40 hover:bg-dark-900/70
      rounded-2xl border border-white/10
      p-4 transition-all duration-300 hover:-translate-y-1 flex flex-col"
    >
      {/* 🔹 IMAGE (ONLY FIRST IMAGE) */}
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

      {/* 🔹 Category + Pricing */}
      <div className="flex justify-between mb-2">
        <span className="text-[9px] px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 uppercase tracking-wider">
          {api.category}
        </span>

        <span className="text-[9px] px-3 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 uppercase tracking-wider">
          {api.pricing?.type || "Unknown"}
        </span>
      </div>

      {/* 🔹 Title */}
      <h3 className="text-white font-bold text-base group-hover:text-mora-400 transition-colors">
        {api.name}
      </h3>

      {/* 🔹 Provider */}
      <p className="text-[11px] text-slate-500 mt-1">
        {api.provider}
      </p>

      {/* 🔹 Description */}
      <p className="text-sm text-slate-400 mt-3 line-clamp-3 flex-grow">
        {api.description}
      </p>

      {/* 🔹 Visit Button */}
      {api.externalUrl && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              window.open(api.externalUrl, "_blank");
            }}
            className="inline-flex items-center gap-1.5
              px-4 py-2 rounded-full
              bg-mora-600 hover:bg-mora-500
              text-white text-xs font-bold uppercase tracking-wider"
          >
            <Globe size={14} />
            Visit
          </button>
        </div>
      )}
    </Link>
  );
};

export default LandingApiCard;