import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Globe,
  Bookmark,
} from "lucide-react";
import { ApiListing } from "../types";

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
  const [saved, setSaved] = useState(false);
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

  useEffect(() => {
    const savedApis = JSON.parse(
      localStorage.getItem("mora_saved_apis") || "[]"
    );

    setSaved(savedApis.includes(api.id));
  }, [api.id]);

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const savedApis = JSON.parse(
      localStorage.getItem("mora_saved_apis") || "[]"
    );

    if (saved) {
      localStorage.setItem(
        "mora_saved_apis",
        JSON.stringify(
          savedApis.filter(
            (id: string) => id !== api.id
          )
        )
      );

      setSaved(false);
    } else {
      localStorage.setItem(
        "mora_saved_apis",
        JSON.stringify([
          ...savedApis,
          api.id,
        ])
      );

      setSaved(true);
    }
  };

  return (
    <Link
      to={`/api/${api.id}`}
      className="
        group
        relative
        bg-dark-900/40
        hover:bg-dark-900/70
        rounded-2xl
        border border-white/10
        p-3.5 md:p-4
        transition-all
        duration-300
        hover:-translate-y-1
        flex flex-col
        min-h-0
      "
    >

      {/* IMAGE */}
      {firstImage && (
        <div
          className="
            w-[85%]
            mx-auto
            aspect-[16/8.5]
            rounded-xl
            overflow-hidden
            mb-3.5
            border border-white/10
            bg-black
          "
        >
          <img
            src={firstImage}
            alt={api.name}
            loading="lazy"
            decoding="async"
            className="
              w-full
              h-full
              object-cover
              transition-transform
              duration-500
              group-hover:scale-[1.03]
            "
          />
        </div>
      )}

      {/* CATEGORY / STATUS ROW */}
      <div className="flex items-center justify-between gap-2 mb-2.5">

        {/* CATEGORY */}
        <span
          className="
            inline-flex
            items-center
            max-w-[65%]
            text-[8px]
            md:text-[9px]
            px-2.5
            py-1
            rounded-full
            bg-mora-500/[0.07]
            border border-mora-500/20
            text-mora-400
            uppercase
            tracking-[0.12em]
            font-semibold
            truncate
          "
        >
          {api.category}
        </span>

        {/* NEW */}
        {isNew(api.createdAt) && (
          <span
            className="
              shrink-0
              text-[8px]
              px-2.5
              py-1
              rounded-full
              bg-white
              text-black
              uppercase
              tracking-wider
              font-bold
            "
          >
            New
          </span>
        )}

        {/* RANK */}
        {rankStyle && !isNew(api.createdAt) && (
          <span
            className={`
              shrink-0
              text-[8px]
              px-2.5
              py-1
              rounded-full
              uppercase
              tracking-wider
              font-bold
              bg-gradient-to-r
              ${rankStyle.color}
              ${rankStyle.text}
            `}
          >
            {rankStyle.label}
          </span>
        )}
      </div>

      {/* TITLE */}
      <h3
        className="
          font-display
          font-bold
          text-white
          text-[15px]
          md:text-base
          leading-tight
          group-hover:text-mora-400
          transition-colors
        "
      >
        <span className="inline-flex items-center flex-wrap gap-0.5">

          {api.name}

          {/* VERIFIED */}
          {isVerified && (
            <span className="relative">

              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowVerifyInfo(
                    (v) => !v
                  );
                }}
                className="
                  h-5
                  w-5
                  flex
                  items-center
                  justify-center
                "
                aria-label="Verified API"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-full h-full"
                >
                  <path
                    fill="#22C55E"
                    d="M22 12c0-1.2-.8-2.3-2-2.8.4-1.2.1-2.6-.8-3.4-.9-.9-2.2-1.2-3.4-.8C15.3 3.8 14.2 3 13 3s-2.3.8-2.8 2c-1.2-.4-2.6-.1-3.4.8-.9.9-1.2 2.2-.8 3.4C4.8 9.7 4 10.8 4 12s.8 2.3 2 2.8c-.4 1.2-.1 2.6.8 3.4.9.9 2.2 1.2 3.4.8.5 1.2 1.6 2 2.8 2s2.3-.8 2.8-2c1.2.4 2.6.1 3.4-.8.9-.9 1.2-2.2.8-3.4.9.5 1.7 1.6 1.7 2.8z"
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
                <div
                  className="
                    absolute
                    left-1/2
                    -translate-x-1/2
                    top-full
                    mt-2
                    z-[200]
                    pointer-events-none
                  "
                >
                  <div
                    className="
                      relative
                      bg-green-600
                      border border-green-700
                      rounded-full
                      px-3
                      py-1
                      text-[10px]
                      text-white
                      font-medium
                      shadow-xl
                      whitespace-nowrap
                    "
                  >
                    <span
                      className="
                        absolute
                        left-1/2
                        -translate-x-1/2
                        -top-1
                        w-2
                        h-2
                        bg-green-600
                        rotate-45
                        border-l
                        border-t
                        border-green-700
                      "
                    />

                    Manually verified by Apives
                  </div>
                </div>
              )}

            </span>
          )}

        </span>
      </h3>

      {/* PROVIDER */}
      <p
        className="
          text-[10px]
          text-slate-500
          mt-1
          truncate
          pr-16
        "
      >
        {api.provider}
      </p>

      {/* DESCRIPTION */}
      <p
        className="
          text-[12px]
          text-slate-400
          mt-2.5
          line-clamp-3
          leading-relaxed
          flex-grow
          pr-10
        "
      >
        {api.description}
      </p>

      {/* BOTTOM ACTIONS */}
      <div
        className="
          mt-3
          flex
          items-center
          justify-end
          gap-2
        "
      >

        {/* SAVE */}
        <button
          onClick={handleSave}
          aria-label={
            saved
              ? "Remove from saved"
              : "Save API"
          }
          className={`
            h-7
            w-7
            rounded-full
            flex
            items-center
            justify-center
            border
            transition-all
            duration-200
            ${
              saved
                ? "bg-green-500 text-black border-green-500"
                : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white"
            }
          `}
        >
          <Bookmark size={13} />
        </button>

        {/* EXTERNAL WEBSITE */}
        {api.externalUrl && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

              window.open(
                api.externalUrl,
                "_blank",
                "noopener,noreferrer"
              );
            }}
            aria-label="Open API website"
            className="
              h-7
              w-7
              rounded-full
              bg-white/5
              border border-white/10
              text-slate-400
              flex
              items-center
              justify-center
              hover:bg-green-500
              hover:text-black
              hover:border-green-500
              transition-all
            "
          >
            <Globe size={13} />
          </button>
        )}

      </div>

    </Link>
  );
};

export default LandingApiCard;