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

/* =========================================================
   TYPES
========================================================= */

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

/* =========================================================
   CONSTANTS
========================================================= */

const GREEN = "#22c55e";

const ADMIN_EMAIL =
  "beatslevelone@gmail.com";

/*
 * IMPORTANT:
 * This MUST match App.tsx.
 *
 * App.tsx currently has:
 *
 * /admin/blogs/publish
 */
const PUBLISH_ROUTE =
  "/admin/blogs/publish";

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
   AUTH HELPERS
========================================================= */

const normalizeEmail = (
  value: unknown
): string => {
  return String(value || "")
    .trim()
    .toLowerCase();
};

/* ---------------------------------------------------------
   Get JWT token
--------------------------------------------------------- */

function getToken(): string {
  try {
    const possibleKeys = [
      "token",
      "accessToken",
      "authToken",
      "jwt",
    ];

    for (const key of possibleKeys) {
      const value =
        localStorage.getItem(key);

      if (
        value &&
        value.trim()
      ) {
        return value.trim();
      }
    }

    return "";
  } catch {
    return "";
  }
}

/* ---------------------------------------------------------
   Decode JWT
--------------------------------------------------------- */

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

    const payload =
      window.atob(base64);

    const decoded =
      JSON.parse(payload);

    const email =
      decoded?.email ||
      decoded?.user?.email ||
      decoded?.data?.email ||
      decoded?.data?.user?.email;

    return normalizeEmail(
      email
    );
  } catch {
    return "";
  }
}

/* ---------------------------------------------------------
   Get email from stored user
--------------------------------------------------------- */

function getEmailFromStoredUser(): string {
  try {
    const userKeys = [
      "user",
      "mora_user",
      "currentUser",
      "loggedInUser",
      "authUser",
    ];

    for (const key of userKeys) {
      const raw =
        localStorage.getItem(key);

      if (!raw) {
        continue;
      }

      try {
        const parsed =
          JSON.parse(raw);

        const email =
          parsed?.email ||
          parsed?.user?.email ||
          parsed?.data?.email ||
          parsed?.data?.user?.email;

        const normalized =
          normalizeEmail(email);

        if (normalized) {
          return normalized;
        }
      } catch {
        continue;
      }
    }

    return "";
  } catch {
    return "";
  }
}

/* ---------------------------------------------------------
   Main email resolver
--------------------------------------------------------- */

function getLoggedInEmail(): string {
  /*
   * JWT is preferred because this is what
   * the backend generates.
   */

  const token =
    getToken();

  const jwtEmail =
    getEmailFromJWT(token);

  if (jwtEmail) {
    return jwtEmail;
  }

  /*
   * Fallback to stored user.
   */

  const storedEmail =
    getEmailFromStoredUser();

  if (storedEmail) {
    return storedEmail;
  }

  return "";
}

/* ---------------------------------------------------------
   Admin check
--------------------------------------------------------- */

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

  /* =======================================================
     ADMIN CHECK
  ======================================================= */

  useEffect(() => {
    updateSEO();

    window.scrollTo({
      top: 0,
      behavior: "auto",
    });

    const checkAdmin =
      () => {
        const email =
          getLoggedInEmail();

        const adminEmail =
          ADMIN_EMAIL
            .trim()
            .toLowerCase();

        const admin =
          email ===
          adminEmail;

        console.log(
          "[Apives] Admin check:",
          {
            loggedInEmail:
              email,
            adminEmail,
            isAdmin: admin,
            hasToken:
              !!getToken(),
          }
        );

        setIsAdmin(admin);
      };

    checkAdmin();

    /*
     * Re-check if auth state changes.
     */

    window.addEventListener(
      "storage",
      checkAdmin
    );

    window.addEventListener(
      "auth-change",
      checkAdmin
    );

    return () => {
      window.removeEventListener(
        "storage",
        checkAdmin
      );

      window.removeEventListener(
        "auth-change",
        checkAdmin
      );
    };
  }, []);

  /* =======================================================
     SEARCH
  ======================================================= */

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

  /* =======================================================
     OPEN BLOG
  ======================================================= */

  const openItem = (
    item: BlogItem
  ) => {
    if (
      item.type ===
      "article"
    ) {
      navigate(
        `/blogs/${item.slug}`
      );

      return;
    }

    navigate(
      `/posts/${item.slug}`
    );
  };

  /* =======================================================
     OPEN PUBLISH
  ======================================================= */

  const openPublishPage =
    () => {
      /*
       * Double-check admin before
       * opening the admin editor.
       */

      const email =
        getLoggedInEmail();

      if (
        email !==
        ADMIN_EMAIL
          .trim()
          .toLowerCase()
      ) {
        console.error(
          "Publish access denied:",
          {
            loggedInEmail:
              email,
            expected:
              ADMIN_EMAIL,
          }
        );

        return;
      }

      /*
       * IMPORTANT:
       * This matches App.tsx:
       *
       * /admin/blogs/publish
       */

      navigate(
        PUBLISH_ROUTE
      );
    };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <>
      <BlogStyles />

      <main className="blog-root">

        {/* =================================================
            HERO
        ================================================= */}

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

        {/* =================================================
            SEARCH
        ================================================= */}

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
              ADMIN PUBLISH BUTTON

              BELOW SEARCH BOX
          ================================================= */}

          {isAdmin && (
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
                strokeWidth={2.3}
              />

              <span>
                Publish
              </span>
            </button>
          )}

        </section>

        {/* =================================================
            ARTICLES
        ================================================= */}

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

      /* =====================================================
         ROOT
      ===================================================== */

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

      /* =====================================================
         HERO
      ===================================================== */

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
          clamp(
            16px,
            2.2vw,
            20px
          );

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

      /* =====================================================
         ADMIN PUBLISH BUTTON
         BELOW SEARCH
      ===================================================== */

      .admin-publish-button {
        width: 100%;

        max-width: 440px;

        height: 42px;

        margin-top: 10px;

        display: flex;

        align-items: center;
        justify-content: center;

        gap: 7px;

        border:
          1px solid
          rgba(34,197,94,.28);

        border-radius: 999px;

        background:
          rgba(34,197,94,.055);

        color: ${GREEN};

        font-family: inherit;

        font-size: 10px;

        font-weight: 800;

        letter-spacing: .1em;

        text-transform: uppercase;

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
          rgba(34,197,94,.11);

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
          clamp(
            19.8px,
            3vw,
            27.4px
          );

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
          clamp(
            12.1px,
            1.7vw,
            13.9px
          );

        line-height: 1.8;
      }

      /* =====================================================
         EMPTY
      ===================================================== */

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

        .search-box {
          max-width: 100%;
        }

        .admin-publish-button {
          max-width: 100%;

          height: 40px;

          margin-top: 9px;

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