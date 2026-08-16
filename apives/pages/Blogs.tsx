import React, {
  memo,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Search,
  X,
  Plus,
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

/* =========================================================
   BLOG DATA
========================================================= */

const BLOG_ARTICLES: BlogItem[] =
  ARTICLES.map((article) => ({
    ...article,
    type: "article" as const,
  }));

const POSTS: BlogPost[] = [];

const BLOG_ITEMS: BlogItem[] = [
  ...BLOG_ARTICLES,
  ...POSTS,
];

/* =========================================================
   AUTH / ADMIN CHECK
========================================================= */

/*
 * IMPORTANT:
 *
 * AuthPages.tsx saves login data as:
 *
 * localStorage.setItem(
 *   "mora_user",
 *   JSON.stringify({
 *      ...data.user,
 *      token: data.token
 *   })
 * )
 *
 * So we read `mora_user` first.
 */

interface StoredUser {
  email?: string;
  token?: string;
  user?: {
    email?: string;
  };
}

function getStoredUser(): StoredUser | null {
  try {
    const raw =
      localStorage.getItem(
        "mora_user"
      );

    if (!raw) {
      return null;
    }

    const parsed =
      JSON.parse(raw);

    if (
      parsed &&
      typeof parsed === "object"
    ) {
      return parsed;
    }

    return null;
  } catch (error) {
    console.error(
      "Failed to read mora_user:",
      error
    );

    return null;
  }
}

function getEmailFromJWT(
  token: string
): string {
  if (!token) {
    return "";
  }

  try {
    const parts =
      token.split(".");

    if (parts.length !== 3) {
      return "";
    }

    let base64 =
      parts[1]
        .replace(/-/g, "+")
        .replace(/_/g, "/");

    while (
      base64.length % 4 !== 0
    ) {
      base64 += "=";
    }

    const decoded =
      JSON.parse(
        window.atob(base64)
      );

    return (
      decoded?.email ||
      decoded?.user?.email ||
      ""
    )
      .toString()
      .trim()
      .toLowerCase();
  } catch (error) {
    console.error(
      "JWT email decode failed:",
      error
    );

    return "";
  }
}

function getLoggedInEmail(): string {
  try {
    const storedUser =
      getStoredUser();

    if (!storedUser) {
      return "";
    }

    /*
     * AuthPages.tsx stores:
     *
     * {
     *   ...data.user,
     *   token: data.token
     * }
     */

    if (
      storedUser.email
    ) {
      return String(
        storedUser.email
      )
        .trim()
        .toLowerCase();
    }

    /*
     * Extra fallback in case
     * user is nested.
     */

    if (
      storedUser.user?.email
    ) {
      return String(
        storedUser.user.email
      )
        .trim()
        .toLowerCase();
    }

    /*
     * Final fallback:
     * decode token stored INSIDE mora_user.
     */

    if (
      storedUser.token
    ) {
      const jwtEmail =
        getEmailFromJWT(
          storedUser.token
        );

      if (jwtEmail) {
        return jwtEmail;
      }
    }

    return "";
  } catch (error) {
    console.error(
      "Logged-in email check failed:",
      error
    );

    return "";
  }
}

function isAdminUser(): boolean {
  const email =
    getLoggedInEmail();

  return (
    email ===
    ADMIN_EMAIL
      .trim()
      .toLowerCase()
  );
}

/* =========================================================
   SEO
========================================================= */

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
    meta =
      document.createElement(
        "meta"
      );

    meta.name =
      "description";

    document.head.appendChild(
      meta
    );
  }

  meta.content =
    description;

  let canonical =
    document.head.querySelector(
      'link[rel="canonical"]'
    ) as HTMLLinkElement | null;

  if (!canonical) {
    canonical =
      document.createElement(
        "link"
      );

    canonical.rel =
      "canonical";

    document.head.appendChild(
      canonical
    );
  }

  canonical.href =
    `${window.location.origin}/blogs`;
}

/* =========================================================
   BLOG ITEM
========================================================= */

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

/* =========================================================
   BLOGS
========================================================= */

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

    /*
     * Check admin from the SAME
     * auth storage used by AuthPages.tsx.
     */

    const checkAdmin =
      () => {
        setIsAdmin(
          isAdminUser()
        );
      };

    checkAdmin();

    /*
     * Re-check when authentication
     * changes elsewhere.
     */

    window.addEventListener(
      "auth-change",
      checkAdmin
    );

    window.addEventListener(
      "storage",
      checkAdmin
    );

    return () => {
      window.removeEventListener(
        "auth-change",
        checkAdmin
      );

      window.removeEventListener(
        "storage",
        checkAdmin
      );
    };
  }, []);

  const filteredItems =
    useMemo(() => {
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
    if (
      item.type ===
      "article"
    ) {
      window.location.assign(
        `/blogs/${item.slug}`
      );

      return;
    }

    window.location.assign(
      `/posts/${item.slug}`
    );
  };

  /*
   * IMPORTANT:
   *
   * App.tsx currently has:
   *
   * /admin/blogs/publish
   *
   * So use that exact route.
   */

  const openPublishPage =
    () => {
      navigate(
        "/admin/blogs/publish"
      );
    };

  return (
    <>
      <BlogStyles />

      <main className="blog-root">

        <section className="blog-hero">

          <img
            src={BLOG_IMAGE}
            alt="Apives Blog"
            className="blog-hero-image"
            loading="eager"
          />

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
              value={
                searchQuery
              }
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

          {/* =================================================
              ADMIN PUBLISH
              BELOW SEARCH BOX
              ONLY ADMIN
          ================================================= */}

          {isAdmin && (
            <div className="admin-publish-wrap">

              <button
                type="button"
                className="admin-publish-button"
                onClick={
                  openPublishPage
                }
                aria-label="Publish a new blog"
              >
                <Plus
                  size={15}
                  strokeWidth={2.2}
                />

                <span>
                  Publish
                </span>
              </button>

            </div>
          )}

        </section>

        <section className="articles-section">

          <div className="articles-top-line" />

          {filteredItems.length >
          0 ? (
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

/* =========================================================
   STYLES
========================================================= */

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
        background:
          rgba(34,197,94,.22);
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

      .blog-hero-image {
        display: block;

        width: 195px;
        height: auto;

        margin: 0 auto;

        object-fit: contain;

        border-radius: 12px;
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

      /* =====================================================
         SEARCH
      ===================================================== */

      .search-section {
        max-width: 900px;

        margin: 0 auto;

        padding:
          0 24px
          34px;

        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .search-box {
        position: relative;

        width: 100%;
        max-width: 440px;

        height: 48px;
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

      /* =====================================================
         ADMIN PUBLISH
      ===================================================== */

      .admin-publish-wrap {
        width: 100%;

        display: flex;
        justify-content: center;

        margin-top: 12px;
      }

      .admin-publish-button {
        display: inline-flex;

        align-items: center;
        justify-content: center;

        gap: 6px;

        min-height: 34px;

        padding:
          0 14px;

        border:
          1px solid
          rgba(34,197,94,.28);

        border-radius: 999px;

        background:
          rgba(34,197,94,.06);

        color: ${GREEN};

        font-family: inherit;

        font-size: 10px;

        font-weight: 750;

        letter-spacing: .04em;

        cursor: pointer;

        transition:
          background .18s ease,
          border-color .18s ease,
          color .18s ease,
          transform .18s ease,
          box-shadow .18s ease;
      }

      .admin-publish-button:hover {
        background:
          rgba(34,197,94,.12);

        border-color:
          rgba(34,197,94,.48);

        color: #fff;

        transform:
          translateY(-1px);

        box-shadow:
          0 8px 30px
          rgba(34,197,94,.08);
      }

      .admin-publish-button:active {
        transform:
          translateY(0);
      }

      /* =====================================================
         ARTICLES
      ===================================================== */

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

      /* =====================================================
         MOBILE
      ===================================================== */

      @media (max-width: 640px) {

        .blog-hero {
          padding:
            68px 20px
            35px;
        }

        .blog-hero-image {
          width: 172px;
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

        .admin-publish-wrap {
          margin-top: 10px;
        }

        .admin-publish-button {
          min-height: 32px;

          padding:
            0 12px;

          font-size: 9px;
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