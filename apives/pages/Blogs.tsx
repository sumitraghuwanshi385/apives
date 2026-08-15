import React, { memo, useEffect, useMemo, useState } from "react";
import { Search, X } from "lucide-react";

/* =========================================================
   TYPES
========================================================= */

interface BlogArticle {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  type: "article";
}

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  type: "post";
}

/* =========================================================
   CONSTANTS
========================================================= */

const BLOG_IMAGE =
  "https://res.cloudinary.com/dp7avkarg/image/upload/v1786794737/Picsart_26-08-15_17-19-34-167_ozvdlb.png";

const GREEN = "#22c55e";

/* =========================================================
   ARTICLES
   These open the separate Article page.
========================================================= */

const ARTICLES: BlogArticle[] = [
  {
    id: 1,
    slug: "rest-vs-graphql-vs-grpc",
    title: "REST vs GraphQL vs gRPC: Which API Should You Use?",
    excerpt:
      "REST, GraphQL, and gRPC solve different API architecture problems. This practical guide compares their performance, flexibility, developer experience, scalability, tooling, and ideal use cases.",
    date: "August 14, 2026",
    type: "article",
  },
  {
    id: 2,
    slug: "best-llm-apis-2026",
    title: "Best LLM APIs in 2026: OpenAI vs Anthropic vs Gemini",
    excerpt:
      "Compare the leading LLM APIs for modern AI applications across reasoning, multimodal capabilities, context, latency, structured output, reliability, pricing, and production architecture.",
    date: "August 12, 2026",
    type: "article",
  },
  {
    id: 3,
    slug: "api-security-best-practices",
    title: "API Security Best Practices: 10 Common API Security Risks",
    excerpt:
      "Protect your API from common security failures covering authorization, authentication, rate limiting, input validation, excessive data exposure, secret management, HTTPS, and monitoring.",
    date: "August 10, 2026",
    type: "article",
  },
  {
    id: 4,
    slug: "how-to-build-production-ready-api",
    title: "How to Build a Production-Ready API: 7 Essential Steps",
    excerpt:
      "Build an API that is ready for real users, not just local development. Learn how contracts, authentication, validation, errors, testing, monitoring, and documentation fit together.",
    date: "August 8, 2026",
    type: "article",
  },
  {
    id: 5,
    slug: "openapi-specification-guide",
    title: "OpenAPI Specification: Why Your API Needs It",
    excerpt:
      "Discover how a machine-readable API contract can power SDK generation, mock servers, generated types, validation, testing, documentation, and better developer experiences.",
    date: "August 6, 2026",
    type: "article",
  },
  {
    id: 6,
    slug: "webhook-best-practices",
    title: "Webhook Best Practices: How to Build Reliable Webhooks",
    excerpt:
      "Build webhooks that survive retries, duplicate events, timeouts, failures, and traffic spikes with signatures, idempotency, queues, asynchronous processing, and delivery logs.",
    date: "August 4, 2026",
    type: "article",
  },
  {
    id: 7,
    slug: "oauth-2-pkce-client-credentials",
    title: "OAuth 2.0 Explained: PKCE vs Client Credentials",
    excerpt:
      "Understand the OAuth 2.0 flows modern developers actually use, including PKCE, Client Credentials, access tokens, refresh tokens, scopes, and secure token handling.",
    date: "August 2, 2026",
    type: "article",
  },
  {
    id: 8,
    slug: "graphql-n-plus-one-dataloader",
    title: "GraphQL at Scale: How to Fix the N+1 Query Problem",
    excerpt:
      "Learn how batching, DataLoader, caching, pagination, query limits, and monitoring can solve the GraphQL N+1 problem and improve production performance.",
    date: "July 30, 2026",
    type: "article",
  },
  {
    id: 9,
    slug: "api-load-testing-guide",
    title: "API Load Testing: How to Test an API Before Launch",
    excerpt:
      "Find API bottlenecks before real users do. Learn realistic traffic simulation, P95 and P99 latency, throughput, database bottlenecks, and capacity planning.",
    date: "July 28, 2026",
    type: "article",
  },
  {
    id: 10,
    slug: "best-serverless-platforms-api",
    title: "Best Serverless Platforms for APIs in 2026",
    excerpt:
      "Compare AWS Lambda, Cloudflare Workers, and Vercel Functions for modern API hosting, including edge execution, scalability, cold starts, databases, and deployment.",
    date: "July 25, 2026",
    type: "article",
  },
  {
    id: 11,
    slug: "why-apives-verifies-apis",
    title: "Why Apives Verifies APIs Before Listing Them",
    excerpt:
      "API discovery should be more than a directory of links. Learn why verification, documentation, pricing, authentication, real endpoint information, and developer experience matter.",
    date: "July 22, 2026",
    type: "article",
  },
];

/* =========================================================
   POSTS
   Keep your existing posts here.
   These also appear in the same Blog UI and open
   their own separate Post page.
========================================================= */

const POSTS: BlogPost[] = [
  /*
    Example:

    {
      id: 1,
      slug: "your-post-slug",
      title: "Your Post Title",
      excerpt: "Your post excerpt...",
      date: "August 15, 2026",
      type: "post",
    },
  */
];

/* =========================================================
   ALL BLOG ITEMS
========================================================= */

const BLOG_ITEMS = [
  ...ARTICLES,
  ...POSTS,
];

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
    `${window.location.origin}/blog`;
}

/* =========================================================
   BLOG LIST ITEM
========================================================= */

const BlogListItem = memo(
  function BlogListItem({
    item,
    onClick,
  }: {
    item: BlogArticle | BlogPost;
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
   MAIN BLOG PAGE
========================================================= */

export default function Blogs() {
  const [
    searchQuery,
    setSearchQuery,
  ] = useState("");

  useEffect(() => {
    updateSEO();

    window.scrollTo({
      top: 0,
      behavior: "auto",
    });
  }, []);

  /* =======================================================
     SEARCH
  ======================================================= */

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

  /* =======================================================
     OPEN SEPARATE PAGE
  ======================================================= */

  const openItem = (
    item: BlogArticle | BlogPost
  ) => {
    if (item.type === "article") {
      window.location.assign(
        `/articles/${item.slug}`
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

        {/* =================================================
            BLOG ITEMS
        ================================================= */}

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

      /* ============================================
         ROOT
      ============================================ */

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

      /* ============================================
         HERO
      ============================================ */

      .blog-hero {
        max-width: 900px;

        margin: 0 auto;

        padding:
          82px 24px
          55px;

        text-align: center;
      }

      .blog-hero-image {
        display: block;

        width: 210px;
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
          clamp(17px, 2.2vw, 21px);

        line-height: 1.65;

        letter-spacing: -.15px;
      }

      /* ============================================
         SEARCH
      ============================================ */

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

      /* ============================================
         BLOG LIST
      ============================================ */

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
          36px 0
          39px;

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

        font-size: 11px;

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
          clamp(23px, 3vw, 32px);

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
          clamp(14px, 1.7vw, 16px);

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

      /* ============================================
         MOBILE
      ============================================ */

      @media (max-width: 640px) {

        .blog-hero {
          padding:
            58px 20px
            43px;
        }

        .blog-hero-image {
          width: 185px;
        }

        .blog-hero p {
          margin-top: 20px;

          font-size: 16px;
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
            29px 0
            32px;
        }

        .blog-list-item h2 {
          font-size: 23px;

          letter-spacing:
            -.55px;
        }

        .blog-list-item p {
          font-size: 14px;

          line-height: 1.75;
        }
      }

    `}</style>
  );
}