import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bookmark,
  Heart,
  Globe,
} from "lucide-react";
import { ApiListing } from "../types";
import { apiService } from "../services/apiClient";

interface Props {
  api: ApiListing;
  topIds?: string[];
}

const RANK_BADGE_STYLES = [
  {
    label: "Apex",
    color: "from-amber-400 to-yellow-600",
    text: "text-black",
  },
  {
    label: "Prime",
    color: "from-slate-200 to-slate-400",
    text: "text-black",
  },
  {
    label: "Zenith",
    color: "from-orange-400 to-amber-700",
    text: "text-white",
  },
];

const isNew = (dateString?: string) => {
  if (!dateString) return false;

  const publishedDate = new Date(dateString).getTime();

  if (Number.isNaN(publishedDate)) return false;

  return Date.now() - publishedDate < 15 * 24 * 60 * 60 * 1000;
};

const LandingApiCard: React.FC<Props> = ({
  api,
  topIds = [],
}) => {
  const navigate = useNavigate();

  const [saved, setSaved] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(api.upvotes || 0);
  const [showVerifyInfo, setShowVerifyInfo] = useState(false);

  const isVerified = api.verified;

  const firstImage =
    Array.isArray(api.gallery) && api.gallery.length > 0
      ? api.gallery[0]
      : null;

  const rankIndex = topIds.indexOf(api.id);

  const rankStyle =
    rankIndex !== -1
      ? RANK_BADGE_STYLES[rankIndex]
      : null;

  /*
   * Sync real API like count whenever
   * the API data changes/refetches.
   */
  useEffect(() => {
    setLikeCount(api.upvotes || 0);
  }, [api.id, api.upvotes]);

  /*
   * Sync saved + liked state from localStorage.
   */
  useEffect(() => {
    try {
      const likedApis = JSON.parse(
        localStorage.getItem("mora_liked_apis") || "[]"
      );

      const savedApis = JSON.parse(
        localStorage.getItem("mora_saved_apis") || "[]"
      );

      setIsLiked(likedApis.includes(api.id));
      setSaved(savedApis.includes(api.id));
    } catch (error) {
      console.error("Failed to sync API state:", error);
    }
  }, [api.id]);

  /*
   * SAVE API
   */
  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const user = localStorage.getItem("mora_user");

    if (!user) {
      navigate(
        `/access?returnUrl=${encodeURIComponent(
          window.location.pathname
        )}`
      );
      return;
    }

    const savedApis = JSON.parse(
      localStorage.getItem("mora_saved_apis") || "[]"
    );

    if (saved) {
      const updatedSavedApis = savedApis.filter(
        (id: string) => id !== api.id
      );

      localStorage.setItem(
        "mora_saved_apis",
        JSON.stringify(updatedSavedApis)
      );

      setSaved(false);
    } else {
      const updatedSavedApis = [
        ...savedApis,
        api.id,
      ];

      localStorage.setItem(
        "mora_saved_apis",
        JSON.stringify(updatedSavedApis)
      );

      setSaved(true);
    }
  };

  /*
   * REAL LIKE / UNLIKE
   *
   * Uses the same apiService logic from
   * the functional old API card.
   */
  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const user = localStorage.getItem("mora_user");

    if (!user) {
      navigate(
        `/access?returnUrl=${encodeURIComponent(
          window.location.pathname
        )}`
      );
      return;
    }

    try {
      if (isLiked) {
        await apiService.unlikeApi(api.id);

        setIsLiked(false);
        setLikeCount((count) => Math.max(0, count - 1));

        const likedApis = JSON.parse(
          localStorage.getItem("mora_liked_apis") || "[]"
        );

        localStorage.setItem(
          "mora_liked_apis",
          JSON.stringify(
            likedApis.filter(
              (id: string) => id !== api.id
            )
          )
        );
      } else {
        await apiService.likeApi(api.id);

        setIsLiked(true);
        setLikeCount((count) => count + 1);

        const likedApis = JSON.parse(
          localStorage.getItem("mora_liked_apis") || "[]"
        );

        if (!likedApis.includes(api.id)) {
          localStorage.setItem(
            "mora_liked_apis",
            JSON.stringify([
              ...likedApis,
              api.id,
            ])
          );
        }
      }
    } catch (error) {
      console.error("Like failed:", error);
    }
  };

  return (
    <Link
      to={`/api/${api.id}`}
      className="
        group relative
        bg-dark-900/40
        hover:bg-dark-900/70
        rounded-2xl
        border border-white/10
        p-3.5
        transition-all duration-300
        hover:-translate-y-1
        flex flex-col
      "
    >
      {/* IMAGE */}
      {firstImage && (
        <div className="relative overflow-hidden rounded-xl mb-3">
          <img
            src={firstImage}
            alt={api.name}
            loading="lazy"
            decoding="async"
            className="
              w-full
              h-40 md:h-44
              object-cover
              transition-transform duration-500
              group-hover:scale-[1.02]
            "
          />

          {/* CATEGORY - TOP LEFT */}
          <div className="absolute top-2.5 left-2.5 z-10">
            <span
              className="
                inline-flex items-center
                text-[8px]
                px-[8.5px]
                py-[3px]
                rounded-full
                bg-black/60
                backdrop-blur-md
                border border-white/10
                text-slate-200
                uppercase
                tracking-wider
              "
            >
              {api.category}
            </span>
          </div>

          {/* LIKE COUNT + SAVE - TOP RIGHT */}
          <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1.5">
            {/* REAL LIKE COUNT */}
            <button
              onClick={handleLike}
              className="
                h-7
                px-2
                rounded-full
                bg-black/60
                backdrop-blur-md
                border border-white/10
                flex items-center gap-1.5
                transition-all
                active:scale-95
              "
              aria-label={
                isLiked ? "Unlike API" : "Like API"
              }
            >
              <Heart
                size={12}
                strokeWidth={2}
                className={
                  isLiked
                    ? "text-red-500 fill-red-500"
                    : "text-red-400"
                }
              />

              <span className="text-[9px] font-medium text-slate-200">
                {likeCount}
              </span>
            </button>

            {/* SAVE */}
            <button
              onClick={handleSave}
              className={`
                h-7
                w-7
                rounded-full
                flex items-center justify-center
                border
                backdrop-blur-md
                transition-all
                active:scale-90

                ${
                  saved
                    ? "bg-mora-500/20 text-mora-500 border-mora-500/40"
                    : "bg-black/60 border-white/10 text-mora-500 hover:bg-mora-500/20 hover:border-mora-500/40"
                }
              `}
              aria-label={
                saved ? "Unsave API" : "Save API"
              }
            >
              <Bookmark
                size={12}
                strokeWidth={2}
                className={
                  saved ? "fill-current scale-110" : ""
                }
              />
            </button>
          </div>

          {/* RANK + NEW */}
          {(rankStyle || isNew(api.createdAt)) && (
            <div className="absolute bottom-2.5 left-2.5 z-10 flex items-center gap-1.5">
              {rankStyle && (
                <span
                  className={`
                    text-[8px]
                    px-2.5
                    py-1
                    rounded-full
                    uppercase
                    tracking-wider
                    bg-gradient-to-r
                    ${rankStyle.color}
                    ${rankStyle.text}
                  `}
                >
                  {rankStyle.label}
                </span>
              )}

              {isNew(api.createdAt) && (
                <span
                  className="
                    text-[8px]
                    px-2.5
                    py-1
                    rounded-full
                    bg-white
                    text-black
                    uppercase
                    font-bold
                  "
                >
                  New
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* API NAME */}
      <h3
        className="
          font-display
          font-bold
          text-white
          text-sm md:text-base
          leading-tight
          group-hover:text-mora-400
          transition-colors
        "
      >
        <span className="inline-flex items-center flex-wrap gap-0.5">
          {api.name}

          {isVerified && (
            <span className="relative">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();

                  setShowVerifyInfo((v) => !v);
                }}
                className="
                  h-5 w-5
                  md:h-6 md:w-6
                  flex items-center justify-center
                "
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-full h-full"
                >
                  <path
                    fill="#22C55E"
                    d="M22 12c0-1.2-.8-2.3-2-2.8.4-1.2.1-2.6-.8-3.4-.9-.9-2.2-1.2-3.4-.8C15.3 3.8 14.2 3 13 3s-2.3.8-2.8 2c-1.2-.4-2.6-.1-3.4.8-.9.9-1.2 2.2-.8 3.4C4.8 9.7 4 10.8 4 12s.8 2.3 2 2.8c-.4.2-1.2 1.6-2 2.8.4 1.2 1.6 2 2.8 2 1.2 0 2.3-.8 2.8-2 1.2.4 2.6.1 3.4-.8.9-.9 1.2-2.2.8-3.4 1.2-.5 2-1.6 2-2.8z"
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
                  <div className="relative bg-green-600 border border-green-700 rounded-full px-3 py-1 text-[10px] text-white font-medium shadow-xl whitespace-nowrap">
                    <span className="absolute left-1/2 -translate-x-1/2 -top-1 w-2 h-2 bg-green-600 rotate-45 border-l border-t border-green-700" />
                    Manually verified by Apives
                  </div>
                </div>
              )}
            </span>
          )}
        </span>
      </h3>

      {/* PROVIDER */}
      <p className="text-[11px] text-slate-500 mt-1">
        {api.provider}
      </p>

      {/* DESCRIPTION */}
      <p className="text-[12.5px] text-slate-400 mt-3 line-clamp-4 flex-grow">
        {api.description}
      </p>
    </Link>
  );
};

export default LandingApiCard;