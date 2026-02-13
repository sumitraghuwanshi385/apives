import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Heart,
  Bookmark,
  Activity,
  Hash,
  Server,
  Trophy
} from "lucide-react";
import { ApiListing } from "../types";
import { apiService } from "../services/apiClient";

const RANK_BADGE_STYLES = [
  { label: "Apex", color: "from-amber-400 to-yellow-600", text: "text-black" },
  { label: "Prime", color: "from-slate-200 to-slate-400", text: "text-black" },
  { label: "Zenith", color: "from-orange-400 to-amber-700", text: "text-white" }
];

const isNew = (dateString?: string) => {
  if (!dateString) return false;
  const publishedDate = new Date(dateString).getTime();
  if (Number.isNaN(publishedDate)) return false;
  const now = Date.now();
  const fifteenDays = 15 * 24 * 60 * 60 * 1000;
  return now - publishedDate < fifteenDays;
};

const getVerifiedApis = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem("apives_verified_apis") || "[]");
  } catch {
    return [];
  }
};

interface Props {
  api: ApiListing;
  topIds: string[];
  onLikeChange?: (id: string, delta: number) => void;
  refetchLandingApis?: () => Promise<void>;
}

const ApiCard: React.FC<Props> = ({
  api,
  topIds,
  onLikeChange,
  refetchLandingApis
}) => {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showArrows, setShowArrows] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [showVerifyInfo, setShowVerifyInfo] = useState(false);

  const rankIndex = topIds.indexOf(api.id);
  const rankStyle = rankIndex !== -1 ? RANK_BADGE_STYLES[rankIndex] : null;
  const verifiedApis = getVerifiedApis();
  const isVerified = verifiedApis.includes(api.id);

  useEffect(() => {
    const liked = JSON.parse(localStorage.getItem("mora_liked_apis") || "[]");
    const savedApis = JSON.parse(localStorage.getItem("mora_saved_apis") || "[]");
    setIsLiked(liked.includes(api.id));
    setSaved(savedApis.includes(api.id));
  }, [api.id]);

  useEffect(() => {
    if (!showArrows) return;
    const t = setTimeout(() => setShowArrows(false), 3000);
    return () => clearTimeout(t);
  }, [showArrows]);

  useEffect(() => {
    const el = document.getElementById(`card-gallery-${api.id}`);
    if (!el) return;
    const onScroll = () => {
      const cardWidth = el.clientWidth * 0.9;
      setGalleryIndex(Math.round(el.scrollLeft / cardWidth));
    };
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, [api.id]);

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const user = localStorage.getItem("mora_user");
    if (!user) {
      navigate(`/access?returnUrl=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    const savedApis = JSON.parse(localStorage.getItem("mora_saved_apis") || "[]");
    if (saved) {
      setSaved(false);
      localStorage.setItem(
        "mora_saved_apis",
        JSON.stringify(savedApis.filter((id: string) => id !== api.id))
      );
    } else {
      setSaved(true);
      localStorage.setItem(
        "mora_saved_apis",
        JSON.stringify([...savedApis, api.id])
      );
    }
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const user = localStorage.getItem("mora_user");
    if (!user) {
      navigate(`/access?returnUrl=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    try {
      if (isLiked) {
        await apiService.unlikeApi(api.id);
        setIsLiked(false);
        onLikeChange?.(api.id, -1);
      } else {
        await apiService.likeApi(api.id);
        setIsLiked(true);
        onLikeChange?.(api.id, +1);
      }
      await refetchLandingApis?.();
    } catch (err) {
      console.error("Like failed", err);
    }
  };

  const tags = Array.isArray(api.tags) ? api.tags : [];

  return (
    <Link
      to={`/api/${api.id}`}
      className="group relative bg-dark-900/40 hover:bg-dark-900/80 backdrop-blur-sm
      rounded-[1.5rem] md:rounded-[2rem] border border-white/5 hover:border-mora-500/30
      p-4 md:p-5 transition-all duration-500 hover:-translate-y-2 overflow-hidden
      flex flex-col h-full"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-mora-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* TOP */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex gap-2">
          <span className="bg-mora-500/10 border border-mora-500/20 text-mora-400 text-[9px] font-black px-4 py-1 rounded-full uppercase">
            {api.category}
          </span>

          {rankStyle && (
            <span
              className={`bg-gradient-to-r ${rankStyle.color} ${rankStyle.text}
              px-4 py-1 rounded-full text-[9px] font-black uppercase flex items-center gap-1`}
            >
              <Trophy size={9} /> {rankStyle.label}
            </span>
          )}
        </div>

        <button
          onClick={handleSave}
          className={`p-2 rounded-full ${
            saved ? "bg-mora-500/20 text-mora-500" : "bg-white/5 text-slate-500"
          }`}
        >
          <Bookmark size={14} className={saved ? "fill-current" : ""} />
        </button>
      </div>

      {/* TITLE */}
      <h3 className="font-display font-bold text-white text-lg leading-tight">
        {api.name}
        {isVerified && (
          <span className="ml-2 text-green-400 text-xs font-bold">✔</span>
        )}
        {isNew(api.createdAt) && (
          <span className="ml-2 text-[9px] bg-white text-black px-2 py-0.5 rounded-full uppercase font-bold">
            New
          </span>
        )}
      </h3>

      <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1 uppercase">
        <Server size={10} /> {api.provider}
      </p>

      {/* DESCRIPTION */}
      <p className="text-sm text-slate-400 mt-4 line-clamp-4">
        {api.description}
      </p>

      {/* TAGS */}
      <div className="flex flex-wrap gap-2 mt-4">
        {tags.slice(0, 5).map(tag => (
          <span
            key={tag}
            className="text-[9px] text-slate-500 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full flex items-center"
          >
            <Hash size={8} className="mr-1 text-mora-500/50" />
            {tag}
          </span>
        ))}
      </div>

      {/* FOOTER */}
      <div className="mt-auto pt-4 border-t border-white/5 flex justify-between items-center">
        <div className="flex gap-4">
          <span className="flex items-center gap-1 text-xs">
            <Activity size={12} className="text-mora-500" />
            {api.latency}
          </span>

          <button
            onClick={handleLike}
            className="flex items-center gap-1 text-xs font-bold"
          >
            <Heart
              size={12}
              className={
                isLiked
                  ? "text-red-500 fill-current"
                  : "text-red-500/50"
              }
            />
            {api.upvotes || 0}
          </button>
        </div>

        <span
          className={`text-[9px] font-black px-4 py-1 rounded-full border uppercase tracking-widest ${
            api.pricing.type === "Free"
              ? "bg-green-500/10 text-green-400 border-green-500/20"
              : api.pricing.type === "Paid"
              ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
              : "bg-purple-500/10 text-purple-400 border-purple-500/20"
          }`}
        >
          {api.pricing.type}
        </span>
      </div>
    </Link>
  );
};

export default ApiCard;