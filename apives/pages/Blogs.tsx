import React, {
  memo,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Search,
  X,
  Check,
  ChevronRight,
  Share2,
} from "lucide-react";

import { BackButton } from "../components/BackButton";

/* =========================================================
   CONSTANTS
========================================================= */

const BLOG_IMAGE =
  "https://res.cloudinary.com/dp7avkarg/image/upload/v1786794737/Picsart_26-08-15_17-19-34-167_ozvdlb.png";

const GREEN = "#22c55e";
const GREEN_SOFT = "#4ade80";

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

/*
|--------------------------------------------------------------------------
| KEEP YOUR EXISTING ARTICLES ARRAY HERE
|--------------------------------------------------------------------------
|
| IMPORTANT:
| Do not change your existing article data.
| The final ArticleDetail below works with the same ARTICLES array.
|
*/

/* =========================================================
   SEO
========================================================= */

function setMeta(
  name: string,
  content: string,
  property = false
) {
  const attribute = property
    ? "property"
    : "name";

  let element = document.head.querySelector(
    `meta[${attribute}="${name}"]`
  ) as HTMLMetaElement | null;

  if (!element) {
    element = document.createElement("meta");

    element.setAttribute(
      attribute,
      name
    );

    document.head.appendChild(element);
  }

  element.setAttribute(
    "content",
    content
  );
}

function updateSEO(
  article?: Article | null
) {
  const title = article
    ? `${article.title} | Apives`
    : "Apives Blog — API Guides, Engineering & Developer Insights";

  const description = article
    ? article.excerpt
    : "Practical API guides covering REST APIs, GraphQL, API security, authentication, AI APIs, webhooks, OpenAPI, testing and infrastructure.";

  const keywords = article
    ? article.keywords.join(", ")
    : "API blog, API guides, REST API, GraphQL, API security, AI APIs, OpenAPI, webhooks, API testing";

  document.title = title;

  setMeta(
    "description",
    description
  );

  setMeta(
    "keywords",
    keywords
  );

  setMeta(
    "og:title",
    title,
    true
  );

  setMeta(
    "og:description",
    description,
    true
  );

  setMeta(
    "og:type",
    article
      ? "article"
      : "website",
    true
  );

  setMeta(
    "twitter:card",
    "summary"
  );

  setMeta(
    "twitter:title",
    title
  );

  setMeta(
    "twitter:description",
    description
  );

  const canonicalUrl = article
    ? `${window.location.origin}/blog/${article.slug}`
    : `${window.location.origin}/blog`;

  let canonical =
    document.head.querySelector(
      'link[rel="canonical"]'
    ) as HTMLLinkElement | null;

  if (!canonical) {
    canonical =
      document.createElement("link");

    canonical.rel =
      "canonical";

    document.head.appendChild(
      canonical
    );
  }

  canonical.href =
    canonicalUrl;
}

function updateStructuredData(
  article?: Article | null
) {
  document
    .getElementById(
      "apives-blog-schema"
    )
    ?.remove();

  const script =
    document.createElement(
      "script"
    );

  script.id =
    "apives-blog-schema";

  script.type =
    "application/ld+json";

  script.textContent =
    JSON.stringify(
      article
        ? {
            "@context":
              "https://schema.org",

            "@type":
              "Article",

            headline:
              article.title,

            description:
              article.excerpt,

            datePublished:
              article.date,

            author: {
              "@type":
                "Person",

              name:
                "Priince Gupta",

              url:
                "https://x.com/priiincegupta",
            },

            publisher: {
              "@type":
                "Organization",

              name:
                "Apives",
            },

            mainEntityOfPage: {
              "@type":
                "WebPage",

              "@id":
                `${window.location.origin}/blog/${article.slug}`,
            },
          }
        : {
            "@context":
              "https://schema.org",

            "@type":
              "Blog",

            name:
              "Apives Blog",

            description:
              "Practical guides for building, securing and scaling APIs.",

            url:
              `${window.location.origin}/blog`,

            publisher: {
              "@type":
                "Organization",

              name:
                "Apives",
            },
          }
    );

  document.head.appendChild(
    script
  );
}

/* =========================================================
   INLINE CONTENT
========================================================= */

function renderInlineText(
  text: string,
  keyPrefix: string
) {
  const parts =
    text.split(
      /(\[[^\]]+\]\(https?:\/\/[^)]+\))/g
    );

  return parts.map(
    (part, index) => {
      const match =
        part.match(
          /^\[([^\]]+)\]\((https?:\/\/[^)]+)\)$/
        );

      if (!match) {
        return (
          <React.Fragment
            key={`${keyPrefix}-${index}`}
          >
            {part}
          </React.Fragment>
        );
      }

      return (
        <a
          key={`${keyPrefix}-${index}`}
          href={match[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="article-link"
        >
          {match[1]}
        </a>
      );
    }
  );
}

function renderContent(
  text: string
) {
  const lines =
    text.trim().split("\n");

  return lines.map(
    (line, index) => {
      const clean =
        line.trim();

      if (!clean) {
        return (
          <div
            key={`space-${index}`}
            className="article-space"
          />
        );
      }

      if (
        clean.startsWith("## ")
      ) {
        return (
          <h2
            key={`heading-${index}`}
            className="article-heading"
          >
            {clean.slice(3)}
          </h2>
        );
      }

      if (
        clean.startsWith("{") ||
        clean.startsWith('"')
      ) {
        return (
          <pre
            key={`code-${index}`}
            className="article-code"
          >
            {clean}
          </pre>
        );
      }

      return (
        <p
          key={`paragraph-${index}`}
          className="article-paragraph"
        >
          {renderInlineText(
            clean,
            `line-${index}`
          )}
        </p>
      );
    }
  );
}

/* =========================================================
   NATIVE SHARE BUTTON
========================================================= */

function NativeShareButton({
  article,
}: {
  article: Article;
}) {
  const [copied, setCopied] =
    useState(false);

  const shareUrl =
    `${window.location.origin}/blog/${article.slug}`;

  const handleShare =
    async () => {
      /*
       * PRIMARY:
       * Native Android / browser share sheet.
       */
      if (
        typeof navigator !==
          "undefined" &&
        typeof navigator.share ===
          "function"
      ) {
        try {
          await navigator.share({
            title:
              article.title,

            text:
              article.excerpt,

            url:
              shareUrl,
          });

          return;
        } catch (error: any) {
          /*
           * User closing the native share
           * sheet is NOT an error.
           */
          if (
            error?.name ===
            "AbortError"
          ) {
            return;
          }
        }
      }

      /*
       * FALLBACK:
       * If native sharing isn't supported,
       * copy the article URL.
       */
      try {
        await navigator.clipboard.writeText(
          shareUrl
        );

        setCopied(true);

        window.setTimeout(
          () =>
            setCopied(false),
          1800
        );
      } catch {
        const input =
          document.createElement(
            "input"
          );

        input.value =
          shareUrl;

        document.body.appendChild(
          input
        );

        input.select();

        document.execCommand(
          "copy"
        );

        input.remove();

        setCopied(true);

        window.setTimeout(
          () =>
            setCopied(false),
          1800
        );
      }
    };

  return (
    <button
      type="button"
      onClick={handleShare}
      className="native-share-button"
      aria-label={
        copied
          ? "Link copied"
          : "Share article"
      }
      title={
        copied
          ? "Link copied"
          : "Share article"
      }
    >
      {copied ? (
        <Check size={18} />
      ) : (
        <Share2 size={19} />
      )}

      <span className="share-button-label">
        {copied
          ? "Copied"
          : "Share"}
      </span>
    </button>
  );
}

/* =========================================================
   ARTICLE DETAIL
========================================================= */

function ArticleDetail({
  article,
  articles,
  onSelect,
}: {
  article: Article;
  articles: Article[];
  onSelect: (
    article: Article
  ) => void;
}) {
  useEffect(() => {
    updateSEO(article);
    updateStructuredData(article);

    window.scrollTo({
      top: 0,
      behavior: "auto",
    });

    return () => {
      updateSEO(null);
      updateStructuredData(null);
    };
  }, [article]);

  const related =
    articles
      .filter(
        (item) =>
          item.id !==
          article.id
      )
      .slice(0, 3);

  return (
    <main className="blog-root">

      {/* =================================================
          BACK BUTTON
          SAME COMPONENT + SAME SIDE POSITION
      ================================================= */}

      <div className="blog-back-button">
        <BackButton />
      </div>

      <article className="article-page">

        {/* =================================================
            ARTICLE HEADER
            TITLE PUSHED DOWN SO IT NEVER OVERLAPS BACK BTN
        ================================================= */}

        <header className="article-header">

          <h1 className="article-title">
            {article.title}
          </h1>

          <p className="article-excerpt">
            {article.excerpt}
          </p>

          <div className="article-meta">

            <span className="article-date">
              {article.date}
            </span>

            <span className="meta-dot">
              •
            </span>

            <span>
              Posted by{" "}
              <a
                href="https://x.com/priiincegupta"
                target="_blank"
                rel="noopener noreferrer"
                className="author-link"
              >
                @priiincegupta
              </a>
            </span>

          </div>

          {/* =================================================
              ONLY ONE SHARE BUTTON
              OPENS NATIVE SHARE SHEET
          ================================================= */}

          <div className="share-row">
            <NativeShareButton
              article={article}
            />
          </div>

          {/* NORMAL GREY DIVIDER */}

          <div className="article-divider" />

        </header>

        {/* =================================================
            ARTICLE CONTENT
        ================================================= */}

        <div className="article-content">
          {renderContent(
            article.content
          )}
        </div>

        {/* =================================================
            FAQ — 5 PER BLOG
        ================================================= */}

        <section className="faq-section">

          <h2>
            Frequently Asked Questions
          </h2>

          <p className="faq-intro">
            Practical answers to common
            questions developers have
            about this topic.
          </p>

          <div className="faq-list">

            {article.faq
              .slice(0, 5)
              .map(
                (
                  item,
                  index
                ) => (
                  <details
                    key={index}
                    className="faq-item"
                  >
                    <summary>

                      <span>
                        {
                          item.question
                        }
                      </span>

                      <ChevronRight
                        size={17}
                      />

                    </summary>

                    <p>
                      {
                        item.answer
                      }
                    </p>

                  </details>
                )
              )}

          </div>

        </section>

        {/* =================================================
            RELATED
        ================================================= */}

        <section className="related-section">

          <h2>
            More from Apives
          </h2>

          <div>

            {related.map(
              (
                relatedArticle
              ) => (
                <button
                  key={
                    relatedArticle.id
                  }
                  type="button"
                  className="related-item"
                  onClick={() =>
                    onSelect(
                      relatedArticle
                    )
                  }
                >

                  <div>

                    <span className="related-date">
                      {
                        relatedArticle.date
                      }
                    </span>

                    <h3>
                      {
                        relatedArticle.title
                      }
                    </h3>

                    <p>
                      {
                        relatedArticle.excerpt
                      }
                    </p>

                  </div>

                  <ChevronRight
                    size={18}
                  />

                </button>
              )
            )}

          </div>

        </section>

      </article>

    </main>
  );
}

/* =========================================================
   BLOG LIST ITEM
========================================================= */

const ArticleListItem =
  memo(
    function ArticleListItem({
      article,
      onClick,
    }: {
      article: Article;
      onClick: () => void;
    }) {
      return (
        <button
          type="button"
          onClick={onClick}
          className="article-list-item"
        >

          <div className="list-date">
            {article.date}
          </div>

          <h2>
            {article.title}
          </h2>

          <p>
            {article.excerpt}
          </p>

        </button>
      );
    }
  );

/* =========================================================
   MAIN BLOG
========================================================= */

export default function ApivesBlog() {
  const [
    selectedArticle,
    setSelectedArticle,
  ] =
    useState<Article | null>(
      null
    );

  const [
    searchQuery,
    setSearchQuery,
  ] =
    useState("");

  useEffect(() => {
    updateSEO(null);
    updateStructuredData(null);

    return () => {
      document
        .getElementById(
          "apives-blog-schema"
        )
        ?.remove();
    };
  }, []);

  const filteredArticles =
    useMemo(() => {
      const query =
        searchQuery
          .trim()
          .toLowerCase();

      if (!query) {
        return ARTICLES;
      }

      return ARTICLES.filter(
        (article) =>
          article.title
            .toLowerCase()
            .includes(query) ||
          article.excerpt
            .toLowerCase()
            .includes(query) ||
          article.content
            .toLowerCase()
            .includes(query) ||
          article.keywords.some(
            (keyword) =>
              keyword
                .toLowerCase()
                .includes(query)
          )
      );
    }, [searchQuery]);

  /* =======================================================
     DETAIL
  ======================================================= */

  if (selectedArticle) {
    return (
      <>
        <BlogStyles />

        <ArticleDetail
          article={
            selectedArticle
          }
          articles={
            ARTICLES
          }
          onSelect={(
            article
          ) => {
            setSelectedArticle(
              article
            );

            window.scrollTo({
              top: 0,
              behavior:
                "auto",
            });
          }}
        />
      </>
    );
  }

  /* =======================================================
     BLOG INDEX
  ======================================================= */

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
            building better APIs.
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

          {filteredArticles.length ? (
            filteredArticles.map(
              (article) => (
                <ArticleListItem
                  key={
                    article.id
                  }
                  article={
                    article
                  }
                  onClick={() => {
                    setSelectedArticle(
                      article
                    );

                    window.scrollTo({
                      top: 0,
                      behavior:
                        "auto",
                    });
                  }}
                />
              )
            )
          ) : (
            <div className="empty-state">

              <p>
                No articles
                found.
              </p>

              <button
                type="button"
                onClick={() =>
                  setSearchQuery(
                    ""
                  )
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
   FINAL PRODUCTION STYLES
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

      /* =================================================
         ROOT
      ================================================= */

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

      /* =================================================
         BACK BUTTON

         SAME LEFT POSITION
      ================================================= */

      .blog-back-button {
        position: absolute;

        top: 6rem;
        left: 1rem;

        z-index: 30;
      }

      @media (min-width: 1024px) {
        .blog-back-button {
          left: 2rem;
        }
      }

      /* =================================================
         BLOG HERO
      ================================================= */

      .blog-hero {
        max-width: 900px;
        margin: 0 auto;

        padding:
          105px 24px
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
        max-width: 620px;

        margin:
          24px auto 0;

        color: #737373;

        font-size:
          clamp(17px, 2.2vw, 21px);

        line-height: 1.65;
      }

      /* =================================================
         SEARCH
      ================================================= */

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

      /* =================================================
         ARTICLE LIST
      ================================================= */

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

      .article-list-item {
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
      }

      .list-date {
        margin-bottom: 13px;

        color: ${GREEN};

        font-size: 11px;

        font-weight: 650;
      }

      .article-list-item h2 {
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
      }

      .article-list-item p {
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

      /* =================================================
         ARTICLE PAGE

         IMPORTANT:
         More top padding = title goes below
         the BackButton instead of overlapping it.
      ================================================= */

      .article-page {
        width: 100%;

        max-width: 820px;

        margin: 0 auto;

        /*
         * OLD: 110px
         * FINAL: 175px
         */
        padding:
          175px 24px
          105px;
      }

      /* =================================================
         ARTICLE HEADER
      ================================================= */

      .article-header {
        text-align: center;

        /*
         * Reduced slightly so divider
         * stays closer to content.
         */
        padding-bottom: 20px;
      }

      .article-title {
        max-width: 820px;

        margin: 0 auto;

        color: #fff;

        font-size:
          clamp(38px, 6.4vw, 63px);

        line-height: 1.05;

        letter-spacing:
          -3px;

        font-weight: 800;
      }

      .article-excerpt {
        max-width: 720px;

        margin:
          24px auto 0;

        color: #696969;

        font-size:
          clamp(16px, 2vw, 19px);

        line-height: 1.78;
      }

      .article-meta {
        display: flex;

        flex-wrap: wrap;

        align-items: center;

        justify-content: center;

        gap: 8px;

        margin-top: 21px;

        color: #555;

        font-size: 11px;
      }

      .article-date {
        color: ${GREEN};

        font-weight: 650;
      }

      .meta-dot {
        color: #333;
      }

      .author-link {
        color: ${GREEN};

        font-weight: 650;

        text-decoration: none;

        border-bottom:
          1px solid
          rgba(34,197,94,.22);
      }

      .author-link:hover {
        color: ${GREEN_SOFT};
      }

      /* =================================================
         ORIGINAL NATIVE SHARE BUTTON

         ONE BUTTON ONLY
      ================================================= */

      .share-row {
        display: flex;

        align-items: center;
        justify-content: center;

        margin-top: 22px;
      }

      .native-share-button {
        position: relative;

        display: inline-flex;

        align-items: center;
        justify-content: center;

        gap: 8px;

        min-width: 108px;
        height: 42px;

        padding:
          0 15px;

        border:
          1px solid
          rgba(255,255,255,.09);

        border-radius: 999px;

        background:
          rgba(255,255,255,.035);

        color: ${GREEN};

        cursor: pointer;

        font: inherit;

        font-size: 12px;

        font-weight: 650;

        backdrop-filter:
          blur(16px);

        -webkit-backdrop-filter:
          blur(16px);

        box-shadow:
          inset
          0 1px 0
          rgba(255,255,255,.055);

        transition:
          transform .18s ease,
          background .18s ease,
          border-color .18s ease;
      }

      .native-share-button:hover {
        background:
          rgba(255,255,255,.065);

        border-color:
          rgba(34,197,94,.30);

        transform:
          translateY(-1px);
      }

      .native-share-button:active {
        transform:
          scale(.96);
      }

      .native-share-button svg {
        flex-shrink: 0;
      }

      /* =================================================
         DIVIDER

         Closer to first article heading.
      ================================================= */

      .article-divider {
        width: 100%;

        height: 1px;

        /*
         * OLD: 32px
         * FINAL: 25px
         */
        margin-top: 25px;

        background:
          rgba(255,255,255,.10);
      }

      /* =================================================
         CONTENT

         First H2 gap specifically reduced.
      ================================================= */

      .article-content {
        width: 100%;
      }

      .article-heading {
        margin:
          34px 0
          20px;

        color: #f5f5f5;

        font-size:
          clamp(24px, 3.2vw, 31px);

        line-height: 1.25;

        letter-spacing:
          -.8px;

        font-weight: 730;
      }

      /*
       * First heading is now closer to divider.
       */
      .article-divider
      + .article-content
      .article-heading:first-child {
        margin-top: 34px;
      }

      .article-paragraph {
        max-width: 780px;

        margin:
          0 0
          27px;

        color: #858585;

        font-size:
          clamp(16px, 1.75vw, 17px);

        line-height: 2;

        font-weight: 400;

        letter-spacing:
          -.05px;
      }

      .article-link {
        color: ${GREEN};

        text-decoration: underline;

        text-decoration-color:
          rgba(34,197,94,.30);

        text-underline-offset: 4px;
      }

      .article-link:hover {
        color: ${GREEN_SOFT};

        text-decoration-color:
          rgba(34,197,94,.8);
      }

      .article-space {
        height: 2px;
      }

      .article-code {
        overflow-x: auto;

        margin:
          25px 0;

        padding: 18px;

        border:
          1px solid
          rgba(255,255,255,.07);

        border-radius: 12px;

        background:
          rgba(255,255,255,.025);

        color: #929292;

        font-family:
          ui-monospace,
          SFMono-Regular,
          Menlo,
          Monaco,
          Consolas,
          monospace;

        font-size: 12px;

        line-height: 1.7;
      }

      /* =================================================
         FAQ
      ================================================= */

      .faq-section {
        margin-top: 75px;

        padding-top: 45px;

        border-top:
          1px solid
          rgba(255,255,255,.085);
      }

      .faq-section h2,
      .related-section h2 {
        margin: 0;

        color: #f5f5f5;

        font-size:
          clamp(25px, 3.2vw, 31px);

        line-height: 1.25;

        letter-spacing:
          -.8px;

        font-weight: 730;
      }

      .faq-intro {
        margin:
          11px 0 25px;

        color: #555;

        font-size: 13px;

        line-height: 1.75;
      }

      .faq-list {
        border-top:
          1px solid
          rgba(255,255,255,.07);
      }

      .faq-item {
        border-bottom:
          1px solid
          rgba(255,255,255,.07);
      }

      .faq-item summary {
        display: flex;

        align-items: center;

        justify-content: space-between;

        gap: 20px;

        padding:
          22px 0;

        list-style: none;

        color: #c9c9c9;

        font-size:
          clamp(14px, 2vw, 16px);

        line-height: 1.5;

        font-weight: 620;

        cursor: pointer;
      }

      .faq-item summary::-webkit-details-marker {
        display: none;
      }

      .faq-item summary svg {
        flex-shrink: 0;

        color: #444;

        transition:
          transform .2s ease,
          color .2s ease;
      }

      .faq-item[open]
      summary svg {
        transform:
          rotate(90deg);

        color: ${GREEN};
      }

      .faq-item[open]
      summary {
        color: #fff;
      }

      .faq-item p {
        max-width: 740px;

        margin:
          -1px 0
          23px;

        color: #6b6b6b;

        font-size: 14px;

        line-height: 1.85;
      }

      /* =================================================
         RELATED
      ================================================= */

      .related-section {
        margin-top: 75px;

        padding-top: 45px;

        border-top:
          1px solid
          rgba(255,255,255,.085);
      }

      .related-section h2 {
        margin-bottom: 17px;
      }

      .related-item {
        width: 100%;

        display: flex;

        align-items: center;

        justify-content: space-between;

        gap: 25px;

        padding:
          23px 0;

        border: 0;

        border-bottom:
          1px solid
          rgba(255,255,255,.07);

        background: transparent;

        color: inherit;

        text-align: left;

        cursor: pointer;

        font: inherit;
      }

      .related-item > div {
        min-width: 0;
      }

      .related-date {
        display: block;

        margin-bottom: 7px;

        color: ${GREEN};

        font-size: 10px;

        font-weight: 650;
      }

      .related-item h3 {
        margin: 0;

        color: #c7c7c7;

        font-size:
          clamp(15px, 2vw, 19px);

        line-height: 1.4;

        font-weight: 620;
      }

      .related-item:hover h3 {
        color: #fff;
      }

      .related-item p {
        margin:
          8px 0 0;

        color: #555;

        font-size: 12px;

        line-height: 1.65;

        display: -webkit-box;

        -webkit-line-clamp: 2;

        -webkit-box-orient: vertical;

        overflow: hidden;
      }

      .related-item > svg {
        flex-shrink: 0;

        color: #333;

        transition:
          color .15s ease,
          transform .15s ease;
      }

      .related-item:hover > svg {
        color: ${GREEN};

        transform:
          translateX(3px);
      }

      /* =================================================
         MOBILE — FINAL SCREENSHOT FIX
      ================================================= */

      @media (max-width: 640px) {

        .blog-back-button {
          top: 6rem;
          left: 1rem;
        }

        /*
         * TITLE MOVED DOWN.
         *
         * This is the main fix from the screenshot.
         */
        .article-page {
          padding:
            178px 20px
            80px;
        }

        .article-header {
          padding-bottom: 16px;
        }

        .article-title {
          font-size:
            clamp(33px, 10vw, 45px);

          letter-spacing:
            -2px;

          line-height: 1.07;
        }

        .article-excerpt {
          margin-top: 21px;

          font-size: 15px;

          line-height: 1.75;
        }

        .article-meta {
          margin-top: 18px;
        }

        .share-row {
          margin-top: 19px;
        }

        .native-share-button {
          height: 40px;

          min-width: 104px;
        }

        /*
         * Divider closer to heading.
         */
        .article-divider {
          margin-top: 21px;
        }

        /*
         * Heading closer to divider.
         */
        .article-heading {
          margin-top: 28px;

          margin-bottom: 18px;
        }

        .article-divider
        + .article-content
        .article-heading:first-child {
          margin-top: 28px;
        }

        .article-paragraph {
          font-size: 15.5px;

          line-height: 1.9;

          margin-bottom: 24px;
        }

        .faq-section,
        .related-section {
          margin-top: 62px;

          padding-top: 35px;
        }

        .blog-hero {
          padding:
            78px 20px
            43px;
        }

        .blog-hero-image {
          width: 185px;
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

        .article-list-item {
          padding:
            29px 0
            32px;
        }

      }

    `}</style>
  );
}