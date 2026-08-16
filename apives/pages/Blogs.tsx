import React, { memo, useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  ARTICLES,
  BLOG_IMAGE,
  type Article,
} from "../components/BlogArticles";

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  type: "post";
}

type BlogItem =
  | (Article & { type: "article" })
  | BlogPost;

const GREEN = "#22c55e";

const ADMIN_EMAIL =
  "beatslevelone@gmail.com";

const BLOG_ARTICLES: BlogItem[] = ARTICLES.map(
  (article) => ({
    ...article,
    type: "article" as const,
  })
);

const POSTS: BlogPost[] = [];

const BLOG_ITEMS: BlogItem[] = [
  ...BLOG_ARTICLES,
  ...POSTS,
];

function updateSEO() {
  document.title =
    "Apives Blog — API Guides, Engineering & Developer Insights";

  const description =
    "Explore practical API engineering guides covering REST APIs, GraphQL, API security, authentication, AI APIs, webhooks, OpenAPI, API testing, serverless infrastructure and developer tools.";

  let meta =
    document.head.querySelector(
      'meta[name="description"]'
    ) as HTMLMetaElement | null;

  if (!meta) {
    meta = document.createElement("meta");
    meta.name = "description";
    document.head.appendChild(meta);
  }

  meta.content = description;

  let canonical =
    document.head.querySelector(
      'link[rel="canonical"]'
    ) as HTMLLinkElement | null;

  if (!canonical) {
    canonical = document.createElement("link");
    canonical.rel = "canonical";
    document.head.appendChild(canonical);
  }

  canonical.href =
    `${window.location.origin}/blogs`;
}

/* =========================================================
   ADMIN EMAIL CHECK
========================================================= */

function getLoggedInEmail(): string {
  try {
    const storedUser =
      localStorage.getItem("user");

    if (storedUser) {
      const user =
        JSON.parse(storedUser);

      const email =
        user?.email ||
        user?.user?.email;

      if (email) {
        return String(email)
          .toLowerCase()
          .trim();
      }
    }
  } catch {
    // Ignore invalid localStorage user data
  }

  try {
    const token =
      localStorage.getItem("token");

    if (!token) {
      return "";
    }

    const parts =
      token.split(".");

    if (parts.length !== 3) {
      return "";
    }

    const payload =
      JSON.parse(
        atob(
          parts[1]
            .replace(/-/g, "+")
            .replace(/_/g, "/")
        )
      );

    const email =
      payload?.email ||
      payload?.user?.email;

    if (!email) {
      return "";
    }

    return String(email)
      .toLowerCase()
      .trim();
  } catch {
    return "";
  }
}

const BlogListItem = memo(
  function BlogListItem({
    item,
    onClick,
  }: {
    item: BlogItem;
    onClick: () => void;
  }) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="blog-list-item"
      >
        <div className="list-date">
          {item.date}
        </div>

        <h2>
          {item.title}
        </h2>

        <p>
          {item.excerpt}
        </p>
      </button>
    );
  }
);

export default function Blogs() {
  const navigate =
    useNavigate();

  const [
    searchQuery,
    setSearchQuery,
  ] = useState("");

  const [
    isAdmin,
    setIsAdmin,
  ] = useState(false);

  useEffect(() => {
    updateSEO();

    window.scrollTo({
      top: 0,
      behavior: "auto",
    });

    const email =
      getLoggedInEmail();

    setIsAdmin(
      email ===
        ADMIN_EMAIL
    );
  }, []);

  const filteredItems = useMemo(() => {
    const query =
      searchQuery
        .trim()
        .toLowerCase();

    if (!query) {
      return BLOG_ITEMS;
    }

    return BLOG_ITEMS.filter(
      (item) =>
        item.title
          .toLowerCase()
          .includes(query) ||
        item.excerpt
          .toLowerCase()
          .includes(query) ||
        item.date
          .toLowerCase()
          .includes(query)
    );
  }, [searchQuery]);

  const openItem = (
    item: BlogItem
  ) => {
    if (item.type === "article") {
      window.location.assign(
        `/blogs/${item.slug}`
      );

      return;
    }

    window.location.assign(
      `/posts/${item.slug}`
    );
  };

  return (
    <>
      <BlogStyles />

      <main className="blog-root">

        <section className="blog-hero">

          <div className="blog-hero-admin-row">

            <img
              src={BLOG_IMAGE}
              alt="Apives Blog"
              className="blog-hero-image"
              loading="eager"
            />

            {isAdmin && (
              <button
                type="button"
                className="publish-blog-button"
                onClick={() =>
                  navigate(
                    "/publish-blog"
                  )
                }
              >
                <Plus size={15} />
                <span>
                  Publish Blog
                </span>
              </button>
            )}

          </div>

          <p>
            Practical ideas for
            building better APIs,
            smarter developer tools,
            and scalable software.
          </p>

        </section>

        <section className="search-section">

          <div className="search-box">

            <Search
              size={16}
              className="search-icon"
            />

            <input
              type="text"
              value={searchQuery}
              onChange={(event) =>
                setSearchQuery(
                  event.target.value
                )
              }
              placeholder="Search articles..."
              aria-label="Search articles"
            />

            {searchQuery && (
              <button
                type="button"
                className="clear-search"
                onClick={() =>
                  setSearchQuery("")
                }
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}

          </div>

        </section>

        <section className="articles-section">

          <div className="articles-top-line" />

          {filteredItems.length > 0 ? (
            filteredItems.map(
              (item) => (
                <BlogListItem
                  key={`${item.type}-${item.id}`}
                  item={item}
                  onClick={() =>
                    openItem(item)
                  }
                />
              )
            )
          ) : (
            <div className="empty-state">

              <p>
                No articles found.
              </p>

              <button
                type="button"
                onClick={() =>
                  setSearchQuery("")
                }
              >
                Clear search
              </button>

            </div>
          )}

        </section>

      </main>
    </>
  );
}

function BlogStyles() {
  return (
    <style>{`

      html {
        scroll-behavior: smooth;
        background: #000;
      }

      body {
        margin: 0;
        background: #000 !important;
        color: #fff;
      }

      *,
      *::before,
      *::after {
        box-sizing: border-box;
      }

      ::selection {
        background: rgba(34,197,94,.22);
        color: #fff;
      }

      ::-webkit-scrollbar {
        width: 4px;
      }

      ::-webkit-scrollbar-track {
        background: #000;
      }

      ::-webkit-scrollbar-thumb {
        background: #242424;
        border-radius: 999px;
      }

      ::-webkit-scrollbar-thumb:hover {
        background: ${GREEN};
      }

      .blog-root {
        min-height: 100vh;
        width: 100%;

        background: #000;
        color: #fff;

        font-family:
          Inter,
          ui-sans-serif,
          system-ui,
          -apple-system,
          BlinkMacSystemFont,
          "Segoe UI",
          sans-serif;
      }

      .blog-hero {
        max-width: 900px;

        margin: 0 auto;

        padding:
          92px 24px
          45px;

        text-align: center;
      }

      .blog-hero-admin-row {
        position: relative;

        display: flex;

        align-items: center;

        justify-content: center;

        width: 100%;
      }

      .blog-hero-image {
        display: block;

        width: 195px;
        height: auto;

        margin: 0 auto;

        object-fit: contain;

        border-radius: 12px;
      }

      .publish-blog-button {
        position: absolute;

        right: 0;

        top: 50%;

        transform:
          translateY(-50%);

        display: inline-flex;

        align-items: center;
        justify-content: center;

        gap: 7px;

        min-height: 36px;

        padding:
          0 13px;

        border:
          1px solid
          rgba(34,197,94,.28);

        border-radius: 999px;

        background:
          rgba(34,197,94,.08);

        color: ${GREEN};

        font: inherit;

        font-size: 10px;

        font-weight: 750;

        letter-spacing: .02em;

        cursor: pointer;

        box-shadow:
          0 0 22px
          rgba(34,197,94,.06);

        transition:
          transform .18s ease,
          background .18s ease,
          border-color .18s ease,
          color .18s ease;
      }

      .publish-blog-button:hover {
        transform:
          translateY(
            calc(-50% - 2px)
          );

        background:
          rgba(34,197,94,.14);

        border-color:
          rgba(34,197,94,.48);

        color: #fff;
      }

      .publish-blog-button:active {
        transform:
          translateY(-50%)
          scale(.96);
      }

      .blog-hero p {
        max-width: 650px;

        margin:
          24px auto 0;

        color: #737373;

        font-size:
          clamp(16px, 2.2vw, 20px);

        line-height: 1.65;

        letter-spacing: -.15px;
      }

      .search-section {
        max-width: 900px;

        margin: 0 auto;

        padding:
          0 24px
          34px;
      }

      .search-box {
        position: relative;

        max-width: 440px;

        height: 48px;

        margin: 0 auto;
      }

      .search-box input {
        width: 100%;
        height: 100%;

        padding:
          0 44px
          0 42px;

        border:
          1px solid
          rgba(255,255,255,.10);

        border-radius: 999px;

        outline: none;

        background:
          rgba(255,255,255,.025);

        color: #e5e7eb;

        font: inherit;

        font-size: 14px;

        transition:
          border-color .18s ease,
          background .18s ease,
          box-shadow .18s ease;
      }

      .search-box input::placeholder {
        color: #505050;
      }

      .search-box input:focus {
        border-color:
          rgba(34,197,94,.42);

        background:
          rgba(255,255,255,.035);

        box-shadow:
          0 0 0 3px
          rgba(34,197,94,.045);
      }

      .search-icon {
        position: absolute;

        z-index: 2;

        left: 16px;
        top: 50%;

        transform:
          translateY(-50%);

        color: #5c5c5c;

        pointer-events: none;
      }

      .clear-search {
        position: absolute;

        right: 9px;
        top: 50%;

        transform:
          translateY(-50%);

        width: 29px;
        height: 29px;

        display: flex;

        align-items: center;
        justify-content: center;

        border: 0;

        border-radius: 50%;

        background: transparent;

        color: #555;

        cursor: pointer;
      }

      .clear-search:hover {
        color: #fff;

        background:
          rgba(255,255,255,.07);
      }

      .articles-section {
        max-width: 900px;

        margin: 0 auto;

        padding:
          0 24px
          110px;
      }

      .articles-top-line {
        height: 1px;

        background:
          rgba(255,255,255,.085);
      }

      .blog-list-item {
        width: 100%;

        display: block;

        padding:
          33.5px 0
          36.3px;

        text-align: left;

        border: 0;

        border-bottom:
          1px solid
          rgba(255,255,255,.085);

        background: transparent;

        color: inherit;

        cursor: pointer;

        font: inherit;

        outline: none;
      }

      .list-date {
        margin-bottom: 13px;

        color: ${GREEN};

        font-size: 9.9px;

        font-weight: 650;

        letter-spacing: .015em;
      }

      .blog-list-item h2 {
        max-width: 850px;

        margin:
          0 0
          11px;

        color: #f5f5f5;

        font-size:
          clamp(19.8px, 3vw, 27.4px);

        line-height: 1.25;

        letter-spacing:
          -.85px;

        font-weight: 670;

        transition:
          color .18s ease;
      }

      .blog-list-item:hover h2 {
        color: #fff;
      }

      .blog-list-item p {
        max-width: 820px;

        margin: 0;

        color: #626262;

        font-size:
          clamp(12.1px, 1.7vw, 13.9px);

        line-height: 1.8;
      }

      .empty-state {
        padding: 90px 0;

        text-align: center;

        color: #555;
      }

      .empty-state button {
        margin-top: 12px;

        padding: 0;

        border: 0;

        background: transparent;

        color: ${GREEN};

        font: inherit;

        font-size: 12px;

        cursor: pointer;
      }

      @media (max-width: 700px) {

        .publish-blog-button {
          position: static;

          transform: none;

          margin-left: 12px;

          flex-shrink: 0;
        }

        .publish-blog-button:hover {
          transform:
            translateY(-2px);
        }

        .blog-hero-admin-row {
          justify-content: center;
        }

      }

      @media (max-width: 640px) {

        .blog-hero {
          padding:
            68px 20px
            35px;
        }

        .blog-hero-image {
          width: 172px;
        }

        .publish-blog-button {
          min-height: 34px;

          padding:
            0 10px;

          font-size: 9px;
        }

        .publish-blog-button svg {
          width: 14px;
          height: 14px;
        }

        .blog-hero p {
          margin-top: 20px;

          font-size: 15.2px;
        }

        .search-section {
          padding:
            0 20px
            28px;
        }

        .articles-section {
          padding:
            0 20px
            80px;
        }

        .blog-list-item {
          padding:
            27px 0
            29.8px;
        }

        .list-date {
          font-size: 8.9px;
        }

        .blog-list-item h2 {
          font-size: 19.7px;

          letter-spacing:
            -.55px;
        }

        .blog-list-item p {
          font-size: 12.1px;

          line-height: 1.75;
        }
      }

    `}</style>
  );
}