import React, {
  memo,
  useMemo,
  useState,
} from "react";

import {
  Search,
  X,
  ArrowUpRight,
  BookOpen,
} from "lucide-react";

/* =========================================================
   TYPES
========================================================= */

interface FAQ {
  question: string;
  answer: string;
}

interface Article {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  content: string;
  keywords: string[];
  faq: FAQ[];
}

/* =========================================================
   CONSTANTS
========================================================= */

const GREEN = "#22c55e";

const BLOG_IMAGE =
  "https://res.cloudinary.com/dp7avkarg/image/upload/v1786794737/Picsart_26-08-15_17-19-34-167_ozvdlb.png";

/* =========================================================
   ARTICLES
   ---------------------------------------------------------
   IMPORTANT:
   BlogArticles.tsx should export ARTICLES if you want
   to import the same data here.

   If ARTICLES is currently not exported there, change:

   const ARTICLES: Article[] = [

   to:

   export const ARTICLES: Article[] = [
========================================================= */

/*
  If you already exported ARTICLES from BlogArticles.tsx,
  replace this import section with:

  import { ARTICLES } from "./BlogArticles";

  And remove the local ARTICLES array below.
*/

/* =========================================================
   LOCAL ARTICLE DATA
   ---------------------------------------------------------
   This is intentionally lightweight because the full article
   content remains inside BlogArticles.tsx.
========================================================= */

const ARTICLES: Article[] = [
  {
    id: 1,
    slug: "rest-vs-graphql-vs-grpc",
    title:
      "REST vs GraphQL vs gRPC: Which API Should You Use?",
    excerpt:
      "REST, GraphQL, and gRPC solve different API architecture problems. This practical guide compares their performance, flexibility, developer experience, scalability, tooling, and ideal use cases.",
    date: "August 14, 2026",
    keywords: [
      "REST API",
      "GraphQL",
      "gRPC",
      "API architecture",
    ],
    content: "",
    faq: [],
  },

  {
    id: 2,
    slug: "best-llm-apis-2026",
    title:
      "Best LLM APIs in 2026: OpenAI vs Anthropic vs Gemini",
    excerpt:
      "Compare the leading LLM APIs for modern AI applications across reasoning, multimodal capabilities, context, latency, structured output, reliability, pricing, and production AI architecture.",
    date: "August 12, 2026",
    keywords: [
      "LLM APIs",
      "AI APIs",
      "OpenAI",
      "Anthropic",
      "Gemini",
    ],
    content: "",
    faq: [],
  },

  {
    id: 3,
    slug: "api-security-best-practices",
    title:
      "API Security Best Practices: 10 Common API Security Risks",
    excerpt:
      "Protect your API from the most common security failures. Learn about authorization, authentication, rate limiting, input validation, excessive data exposure, secrets, HTTPS, logging, and OWASP API security principles.",
    date: "August 10, 2026",
    keywords: [
      "API security",
      "OWASP",
      "authentication",
      "authorization",
    ],
    content: "",
    faq: [],
  },

  {
    id: 4,
    slug: "how-to-build-production-ready-api",
    title:
      "How to Build a Production-Ready API: 7 Essential Steps",
    excerpt:
      "Build an API that is ready for real users, not just local development. Learn how API contracts, authentication, authorization, validation, errors, testing, monitoring, documentation, and scalability fit together.",
    date: "August 8, 2026",
    keywords: [
      "API development",
      "production API",
      "API testing",
      "API documentation",
    ],
    content: "",
    faq: [],
  },

  {
    id: 5,
    slug: "openapi-specification-guide",
    title:
      "OpenAPI Specification: Why Your API Needs It",
    excerpt:
      "OpenAPI is more than API documentation. Discover how a machine-readable API contract can power SDK generation, mock servers, generated types, validation, testing, documentation, and better developer experiences.",
    date: "August 6, 2026",
    keywords: [
      "OpenAPI",
      "Swagger",
      "API documentation",
      "SDK generation",
    ],
    content: "",
    faq: [],
  },

  {
    id: 6,
    slug: "webhook-best-practices",
    title:
      "Webhook Best Practices: How to Build Reliable Webhooks",
    excerpt:
      "Build webhooks that survive retries, duplicate events, timeouts, failures, and traffic spikes. Learn signature verification, idempotency, queues, asynchronous processing, delivery logs, ordering, and reliable architecture.",
    date: "August 4, 2026",
    keywords: [
      "webhooks",
      "webhook security",
      "webhook retries",
      "idempotency",
    ],
    content: "",
    faq: [],
  },

  {
    id: 7,
    slug: "oauth-2-pkce-client-credentials",
    title:
      "OAuth 2.0 Explained: PKCE vs Client Credentials",
    excerpt:
      "Understand the OAuth 2.0 flows modern developers actually use. Learn how Authorization Code with PKCE, Client Credentials, access tokens, refresh tokens, scopes, and secure token handling work.",
    date: "August 2, 2026",
    keywords: [
      "OAuth 2.0",
      "PKCE",
      "Client Credentials",
      "API authentication",
    ],
    content: "",
    faq: [],
  },

  {
    id: 8,
    slug: "graphql-n-plus-one-dataloader",
    title:
      "GraphQL at Scale: How to Fix the N+1 Query Problem",
    excerpt:
      "GraphQL gives clients powerful data-fetching flexibility, but poorly designed resolvers can create hundreds of database queries. Learn how batching, DataLoader, caching, pagination, query limits, and monitoring solve the N+1 problem.",
    date: "July 30, 2026",
    keywords: [
      "GraphQL",
      "N+1",
      "DataLoader",
      "GraphQL performance",
    ],
    content: "",
    faq: [],
  },

  {
    id: 9,
    slug: "api-load-testing-guide",
    title:
      "API Load Testing: How to Test an API Before Launch",
    excerpt:
      "Find API bottlenecks before real users do. Learn realistic traffic simulation, P95 and P99 latency, throughput, database bottlenecks, error rates, capacity planning, and performance testing workflows.",
    date: "July 28, 2026",
    keywords: [
      "API load testing",
      "performance testing",
      "k6",
      "API scalability",
    ],
    content: "",
    faq: [],
  },

  {
    id: 10,
    slug: "best-serverless-platforms-api",
    title:
      "Best Serverless Platforms for APIs in 2026",
    excerpt:
      "Compare AWS Lambda, Cloudflare Workers, and Vercel Functions for modern API hosting. Understand edge execution, scalability, cold starts, database connectivity, deployment experience, and pricing considerations.",
    date: "July 25, 2026",
    keywords: [
      "serverless API",
      "AWS Lambda",
      "Cloudflare Workers",
      "Vercel Functions",
    ],
    content: "",
    faq: [],
  },

  {
    id: 11,
    slug: "why-apives-verifies-apis",
    title:
      "Why Apives Verifies APIs Before Listing Them",
    excerpt:
      "API discovery should be more than a directory of links. Learn why verification, clear documentation, pricing, authentication details, real endpoint information, examples, and developer experience matter when choosing an API.",
    date: "July 22, 2026",
    keywords: [
      "Apives",
      "API directory",
      "verified APIs",
      "API discovery",
    ],
    content: "",
    faq: [],
  },
];

/* =========================================================
   CATEGORY HELPERS
========================================================= */

function getCategory(article: Article) {
  const text = (
    article.title +
    " " +
    article.keywords.join(" ")
  ).toLowerCase();

  if (
    text.includes("graphql") ||
    text.includes("grpc") ||
    text.includes("rest")
  ) {
    return "API Architecture";
  }

  if (
    text.includes("security") ||
    text.includes("oauth")
  ) {
    return "API Security";
  }

  if (
    text.includes("llm") ||
    text.includes("ai")
  ) {
    return "AI APIs";
  }

  if (
    text.includes("webhook")
  ) {
    return "Webhooks";
  }

  if (
    text.includes("serverless") ||
    text.includes("lambda")
  ) {
    return "Infrastructure";
  }

  if (
    text.includes("openapi") ||
    text.includes("swagger")
  ) {
    return "Developer Tools";
  }

  if (
    text.includes("testing") ||
    text.includes("load")
  ) {
    return "API Testing";
  }

  return "Developer Guides";
}

/* =========================================================
   ARTICLE CARD
========================================================= */

const BlogCard = memo(
  function BlogCard({
    article,
    featured = false,
    onClick,
  }: {
    article: Article;
    featured?: boolean;
    onClick: () => void;
  }) {
    const category =
      getCategory(article);

    return (
      <button
        type="button"
        onClick={onClick}
        className={`blog-card ${
          featured
            ? "blog-card-featured"
            : ""
        }`}
      >
        <div className="blog-card-top">
          <span className="blog-category">
            {category}
          </span>

          <span className="blog-card-date">
            {article.date}
          </span>
        </div>

        <div className="blog-card-content">
          <h2>
            {article.title}
          </h2>

          <p>
            {article.excerpt}
          </p>
        </div>

        <div className="blog-card-bottom">
          <span>
            Read article
          </span>

          <ArrowUpRight
            size={16}
          />
        </div>
      </button>
    );
  }
);

/* =========================================================
   MAIN BLOGS PAGE
========================================================= */

export default function Blogs({
  onArticleSelect,
}: {
  onArticleSelect?: (
    article: Article
  ) => void;
}) {
  const [
    searchQuery,
    setSearchQuery,
  ] = useState("");

  const [
    activeCategory,
    setActiveCategory,
  ] = useState("All");

  const categories =
    useMemo(() => {
      const values =
        ARTICLES.map(
          (article) =>
            getCategory(article)
        );

      return [
        "All",
        ...Array.from(
          new Set(values)
        ),
      ];
    }, []);

  const filteredArticles =
    useMemo(() => {
      const query =
        searchQuery
          .trim()
          .toLowerCase();

      return ARTICLES.filter(
        (article) => {
          const matchesSearch =
            !query ||
            article.title
              .toLowerCase()
              .includes(query) ||
            article.excerpt
              .toLowerCase()
              .includes(query) ||
            article.keywords.some(
              (keyword) =>
                keyword
                  .toLowerCase()
                  .includes(query)
            );

          const matchesCategory =
            activeCategory ===
              "All" ||
            getCategory(article) ===
              activeCategory;

          return (
            matchesSearch &&
            matchesCategory
          );
        }
      );
    }, [
      searchQuery,
      activeCategory,
    ]);

  const featuredArticle =
    filteredArticles[0];

  const remainingArticles =
    filteredArticles.slice(1);

  const openArticle = (
    article: Article
  ) => {
    if (onArticleSelect) {
      onArticleSelect(article);
      return;
    }

    /*
      Fallback:
      If this page is being used independently,
      navigate directly to the article URL.
    */

    window.location.assign(
      `/blog/${article.slug}`
    );
  };

  return (
    <>
      <style>{`
        /* =================================================
           BLOGS PAGE
        ================================================= */

        .blogs-root {
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

        .blogs-container {
          width: 100%;
          max-width: 1100px;

          margin: 0 auto;

          padding:
            125px 28px
            110px;
        }

        /* =================================================
           HERO
        ================================================= */

        .blogs-hero {
          text-align: center;

          max-width: 820px;

          margin: 0 auto;

          padding:
            10px 0
            60px;
        }

        .blogs-logo {
          display: block;

          width: 175px;
          height: auto;

          margin: 0 auto 27px;

          object-fit: contain;

          border-radius: 12px;
        }

        .blogs-eyebrow {
          display: inline-flex;

          align-items: center;

          gap: 7px;

          margin-bottom: 17px;

          color: ${GREEN};

          font-size: 11px;

          font-weight: 700;

          letter-spacing: .08em;

          text-transform: uppercase;
        }

        .blogs-eyebrow-dot {
          width: 5px;
          height: 5px;

          border-radius: 50%;

          background: ${GREEN};

          box-shadow:
            0 0 12px
            rgba(34,197,94,.45);
        }

        .blogs-hero h1 {
          margin: 0;

          color: #f5f5f5;

          font-size:
            clamp(42px, 7vw, 76px);

          line-height: 1.02;

          letter-spacing:
            -4px;

          font-weight: 800;
        }

        .blogs-hero p {
          max-width: 680px;

          margin:
            21px auto 0;

          color: #666;

          font-size:
            clamp(15px, 2vw, 18px);

          line-height: 1.75;
        }

        /* =================================================
           SEARCH
        ================================================= */

        .blogs-toolbar {
          display: flex;

          flex-direction: column;

          align-items: center;

          gap: 20px;

          margin-bottom: 48px;
        }

        .blogs-search {
          position: relative;

          width: 100%;
          max-width: 510px;

          height: 50px;
        }

        .blogs-search input {
          width: 100%;
          height: 100%;

          padding:
            0 45px
            0 44px;

          border:
            1px solid
            rgba(255,255,255,.09);

          border-radius: 999px;

          outline: none;

          background:
            rgba(255,255,255,.025);

          color: #eee;

          font: inherit;

          font-size: 14px;

          transition:
            border-color .18s ease,
            background .18s ease,
            box-shadow .18s ease;
        }

        .blogs-search input::placeholder {
          color: #505050;
        }

        .blogs-search input:focus {
          border-color:
            rgba(34,197,94,.38);

          background:
            rgba(255,255,255,.035);

          box-shadow:
            0 0 0 3px
            rgba(34,197,94,.045);
        }

        .blogs-search-icon {
          position: absolute;

          left: 17px;
          top: 50%;

          transform:
            translateY(-50%);

          color: #555;

          pointer-events: none;
        }

        .blogs-clear {
          position: absolute;

          right: 9px;
          top: 50%;

          width: 30px;
          height: 30px;

          display: flex;

          align-items: center;
          justify-content: center;

          transform:
            translateY(-50%);

          border: 0;

          border-radius: 50%;

          background: transparent;

          color: #555;

          cursor: pointer;
        }

        .blogs-clear:hover {
          color: #fff;

          background:
            rgba(255,255,255,.07);
        }

        /* =================================================
           CATEGORIES
        ================================================= */

        .category-row {
          width: 100%;

          display: flex;

          align-items: center;

          justify-content: center;

          flex-wrap: wrap;

          gap: 7px;
        }

        .category-button {
          min-height: 32px;

          padding:
            0 13px;

          border:
            1px solid
            rgba(255,255,255,.07);

          border-radius: 999px;

          background:
            rgba(255,255,255,.02);

          color: #666;

          font: inherit;

          font-size: 11px;

          font-weight: 600;

          cursor: pointer;

          transition:
            color .18s ease,
            border-color .18s ease,
            background .18s ease;
        }

        .category-button:hover {
          color: #aaa;

          border-color:
            rgba(255,255,255,.13);
        }

        .category-button.active {
          color: #000;

          background: ${GREEN};

          border-color: ${GREEN};
        }

        /* =================================================
           SECTION HEADER
        ================================================= */

        .blogs-section-header {
          display: flex;

          align-items: flex-end;

          justify-content: space-between;

          gap: 20px;

          margin-bottom: 17px;

          padding-bottom: 14px;

          border-bottom:
            1px solid
            rgba(255,255,255,.085);
        }

        .blogs-section-header h2 {
          margin: 0;

          color: #eee;

          font-size: 13px;

          font-weight: 650;

          letter-spacing: -.1px;
        }

        .blogs-count {
          color: #454545;

          font-size: 10px;

          font-weight: 600;
        }

        /* =================================================
           FEATURED
        ================================================= */

        .featured-wrap {
          margin-bottom: 12px;
        }

        .blog-card {
          position: relative;

          width: 100%;

          display: flex;

          flex-direction: column;

          align-items: stretch;

          min-height: 270px;

          padding: 29px;

          text-align: left;

          border:
            1px solid
            rgba(255,255,255,.075);

          border-radius: 16px;

          background:
            linear-gradient(
              145deg,
              rgba(255,255,255,.045),
              rgba(255,255,255,.018)
            );

          color: inherit;

          cursor: pointer;

          font: inherit;

          overflow: hidden;

          transition:
            border-color .2s ease,
            transform .2s ease,
            background .2s ease;
        }

        .blog-card::before {
          content: "";

          position: absolute;

          top: -100px;
          right: -80px;

          width: 230px;
          height: 230px;

          border-radius: 50%;

          background:
            radial-gradient(
              circle,
              rgba(34,197,94,.10),
              transparent 68%
            );

          pointer-events: none;
        }

        .blog-card:hover {
          border-color:
            rgba(34,197,94,.24);

          background:
            linear-gradient(
              145deg,
              rgba(255,255,255,.055),
              rgba(255,255,255,.02)
            );

          transform:
            translateY(-2px);
        }

        .blog-card-featured {
          min-height: 315px;

          padding: 38px;
        }

        .blog-card-top {
          position: relative;

          z-index: 1;

          display: flex;

          align-items: center;

          justify-content: space-between;

          gap: 15px;
        }

        .blog-category {
          color: ${GREEN};

          font-size: 10px;

          font-weight: 700;

          letter-spacing: .055em;

          text-transform: uppercase;
        }

        .blog-card-date {
          color: #4b4b4b;

          font-size: 10px;

          font-weight: 600;
        }

        .blog-card-content {
          position: relative;

          z-index: 1;

          flex: 1;

          padding:
            42px 0
            35px;
        }

        .blog-card-content h2 {
          max-width: 830px;

          margin: 0;

          color: #f2f2f2;

          font-size:
            clamp(27px, 4vw, 43px);

          line-height: 1.14;

          letter-spacing:
            -1.6px;

          font-weight: 760;

          transition:
            color .18s ease;
        }

        .blog-card:hover
        .blog-card-content h2 {
          color: #fff;
        }

        .blog-card-content p {
          max-width: 760px;

          margin:
            17px 0 0;

          color: #626262;

          font-size: 14px;

          line-height: 1.8;
        }

        .blog-card-bottom {
          position: relative;

          z-index: 1;

          display: flex;

          align-items: center;

          gap: 7px;

          color: #777;

          font-size: 11px;

          font-weight: 600;
        }

        .blog-card-bottom svg {
          color: ${GREEN};

          transition:
            transform .18s ease;
        }

        .blog-card:hover
        .blog-card-bottom svg {
          transform:
            translate(2px,-2px);
        }

        /* =================================================
           ARTICLE GRID
        ================================================= */

        .articles-grid {
          display: grid;

          grid-template-columns:
            repeat(2, minmax(0, 1fr));

          gap: 12px;
        }

        .articles-grid
        .blog-card {
          min-height: 285px;

          padding: 27px;
        }

        .articles-grid
        .blog-card-content {
          padding:
            31px 0
            27px;
        }

        .articles-grid
        .blog-card-content h2 {
          font-size:
            clamp(21px, 2.5vw, 28px);

          letter-spacing:
            -.85px;
        }

        .articles-grid
        .blog-card-content p {
          font-size: 13px;

          line-height: 1.75;

          display: -webkit-box;

          -webkit-line-clamp: 4;

          -webkit-box-orient: vertical;

          overflow: hidden;
        }

        /* =================================================
           EMPTY
        ================================================= */

        .blogs-empty {
          padding:
            85px 20px;

          text-align: center;

          border:
            1px solid
            rgba(255,255,255,.07);

          border-radius: 15px;

          color: #555;
        }

        .blogs-empty-icon {
          width: 40px;
          height: 40px;

          display: flex;

          align-items: center;
          justify-content: center;

          margin:
            0 auto 13px;

          border:
            1px solid
            rgba(255,255,255,.07);

          border-radius: 50%;

          color: #555;
        }

        .blogs-empty p {
          margin: 0;

          font-size: 13px;
        }

        .blogs-empty button {
          margin-top: 13px;

          padding: 0;

          border: 0;

          background: transparent;

          color: ${GREEN};

          font: inherit;

          font-size: 11px;

          cursor: pointer;
        }

        /* =================================================
           FOOTER NOTE
        ================================================= */

        .blogs-bottom-note {
          margin-top: 70px;

          padding-top: 24px;

          border-top:
            1px solid
            rgba(255,255,255,.065);

          text-align: center;

          color: #3f3f3f;

          font-size: 10px;

          line-height: 1.7;
        }

        /* =================================================
           MOBILE
        ================================================= */

        @media (max-width: 700px) {

          .blogs-container {
            padding:
              88px 20px
              80px;
          }

          .blogs-hero {
            padding:
              20px 0
              43px;
          }

          .blogs-logo {
            width: 155px;

            margin-bottom: 23px;
          }

          .blogs-hero h1 {
            font-size:
              clamp(39px, 12vw, 58px);

            letter-spacing:
              -2.7px;
          }

          .blogs-hero p {
            margin-top: 17px;

            font-size: 15px;

            line-height: 1.7;
          }

          .blogs-toolbar {
            margin-bottom: 35px;
          }

          .category-row {
            justify-content: flex-start;

            overflow-x: auto;

            flex-wrap: nowrap;

            padding-bottom: 3px;

            scrollbar-width: none;
          }

          .category-row::-webkit-scrollbar {
            display: none;
          }

          .category-button {
            flex-shrink: 0;
          }

          .blogs-section-header {
            margin-bottom: 13px;
          }

          .blog-card-featured {
            min-height: 330px;

            padding: 24px;
          }

          .blog-card-content {
            padding:
              40px 0
              32px;
          }

          .blog-card-content h2 {
            font-size:
              clamp(25px, 8vw, 35px);

            letter-spacing:
              -1px;
          }

          .blog-card-content p {
            font-size: 13px;

            line-height: 1.75;
          }

          .articles-grid {
            grid-template-columns:
              1fr;

            gap: 10px;
          }

          .articles-grid
          .blog-card {
            min-height: 260px;

            padding: 23px;
          }

          .articles-grid
          .blog-card-content {
            padding:
              31px 0
              27px;
          }

          .articles-grid
          .blog-card-content h2 {
            font-size: 22px;
          }

          .articles-grid
          .blog-card-content p {
            font-size: 13px;

            -webkit-line-clamp: 5;
          }

        }

        @media (max-width: 420px) {

          .blogs-container {
            padding-left: 17px;
            padding-right: 17px;
          }

          .blogs-search {
            height: 47px;
          }

          .blog-card-featured {
            padding: 21px;
          }

          .blog-card-date {
            font-size: 9px;
          }

          .blog-card-bottom {
            font-size: 10px;
          }

        }

      `}</style>

      <main className="blogs-root">

        <div className="blogs-container">

          {/* =========================================
              HERO
          ========================================= */}

          <section className="blogs-hero">

            <img
              src={BLOG_IMAGE}
              alt="Apives Blog"
              className="blogs-logo"
              loading="eager"
            />

            <div className="blogs-eyebrow">
              <span className="blogs-eyebrow-dot" />
              Apives Blog
            </div>

            <h1>
              Build better APIs.
            </h1>

            <p>
              Practical ideas for building
              better APIs, smarter developer
              tools, and scalable software.
            </p>

          </section>

          {/* =========================================
              SEARCH + CATEGORIES
          ========================================= */}

          <section className="blogs-toolbar">

            <div className="blogs-search">

              <Search
                size={16}
                className="blogs-search-icon"
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
                  className="blogs-clear"
                  aria-label="Clear search"
                  onClick={() =>
                    setSearchQuery("")
                  }
                >
                  <X size={14} />
                </button>
              )}

            </div>

            <div className="category-row">

              {categories.map(
                (category) => (
                  <button
                    key={category}
                    type="button"
                    className={`category-button ${
                      activeCategory ===
                      category
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      setActiveCategory(
                        category
                      )
                    }
                  >
                    {category}
                  </button>
                )
              )}

            </div>

          </section>

          {/* =========================================
              RESULTS
          ========================================= */}

          {filteredArticles.length ? (
            <>
              <section>

                <div className="blogs-section-header">

                  <h2>
                    Latest articles
                  </h2>

                  <span className="blogs-count">
                    {filteredArticles.length}{" "}
                    {filteredArticles.length ===
                    1
                      ? "article"
                      : "articles"}
                  </span>

                </div>

                {/* =====================================
                    FEATURED ARTICLE
                ===================================== */}

                {featuredArticle && (
                  <div className="featured-wrap">

                    <BlogCard
                      article={
                        featuredArticle
                      }
                      featured
                      onClick={() =>
                        openArticle(
                          featuredArticle
                        )
                      }
                    />

                  </div>
                )}

                {/* =====================================
                    REMAINING ARTICLES
                ===================================== */}

                {remainingArticles.length >
                  0 && (
                  <div className="articles-grid">

                    {remainingArticles.map(
                      (article) => (
                        <BlogCard
                          key={article.id}
                          article={article}
                          onClick={() =>
                            openArticle(
                              article
                            )
                          }
                        />
                      )
                    )}

                  </div>
                )}

              </section>
            </>
          ) : (
            <div className="blogs-empty">

              <div className="blogs-empty-icon">
                <BookOpen
                  size={17}
                />
              </div>

              <p>
                No articles found.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("All");
                }}
              >
                Clear filters
              </button>

            </div>
          )}

          {/* =========================================
              BOTTOM
          ========================================= */}

          <div className="blogs-bottom-note">
            New practical guides on APIs,
            developer tools, infrastructure,
            security and AI.
          </div>

        </div>

      </main>
    </>
  );
}