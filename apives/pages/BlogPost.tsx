import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Check,
  ChevronRight,
  Mail,
  Share2,
} from "lucide-react";

import {
  useParams,
} from "react-router-dom";

import {
  ARTICLES,
  type Article,
} from "../components/BlogArticles";

import { BackButton } from "../components/BackButton";

/*
=========================================================
  APIVES BLOG API
=========================================================
*/

const API_BASE = (
  import.meta.env.VITE_API_URL ||
  "https://apives-3xrc.onrender.com"
).replace(/\/+$/, "");

/*
=========================================================
  TYPES
=========================================================
*/

interface BlogAuthor {
  name?: string;
  x?: string;
}

interface BlogFaqItem {
  question: string;
  answer: string;
}

interface BackendBlog {
  _id?: string;
  id?: string | number;

  slug?: string;

  category?: string;

  title?: string;

  excerpt?: string;

  date?: string;

  publishedAt?: string;

  author?: BlogAuthor;

  content?: string;

  keywords?: string[];

  tags?: string[];

  faq?: BlogFaqItem[];

  published?: boolean;

  createdAt?: string;

  updatedAt?: string;

  [key: string]: unknown;
}

interface BlogPostProps {
  article?: Article | null;
  slug?: string;
  onBack?: () => void;
  onSelectArticle?: (
    article: Article
  ) => void;
}

const GREEN = "#22c55e";
const GREEN_SOFT = "#4ade80";

/*
=========================================================
  DATE FORMATTER
=========================================================
*/

function formatBlogDate(
  value: unknown
): string {
  if (!value) {
    return "";
  }

  const raw =
    String(value).trim();

  if (!raw) {
    return "";
  }

  try {
    const dateOnlyMatch =
      raw.match(
        /^(\d{4})-(\d{2})-(\d{2})$/
      );

    const date =
      dateOnlyMatch
        ? new Date(
            Date.UTC(
              Number(
                dateOnlyMatch[1]
              ),
              Number(
                dateOnlyMatch[2]
              ) - 1,
              Number(
                dateOnlyMatch[3]
              )
            )
          )
        : new Date(raw);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return raw;
    }

    return new Intl.DateTimeFormat(
      "en-US",
      {
        month: "long",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
      }
    ).format(date);
  } catch {
    return raw;
  }
}

/*
=========================================================
  META HELPERS
=========================================================
*/

function setMeta(
  name: string,
  content: string,
  property = false
) {
  if (
    typeof document === "undefined"
  ) {
    return;
  }

  const attribute = property
    ? "property"
    : "name";

  let element =
    document.head.querySelector(
      `meta[${attribute}="${name}"]`
    ) as HTMLMetaElement | null;

  if (!element) {
    element =
      document.createElement("meta");

    element.setAttribute(
      attribute,
      name
    );

    document.head.appendChild(
      element
    );
  }

  element.setAttribute(
    "content",
    content || ""
  );
}

/*
=========================================================
  SEO
=========================================================
*/

function updateArticleSEO(
  article: Article | null
) {
  if (
    typeof document === "undefined"
  ) {
    return;
  }

  if (!article) {
    document.title =
      "Apives Blog";

    return;
  }

  const title =
    `${article.title || "Apives Blog"} | Apives`;

  const description =
    article.excerpt || "";

  const keywords =
    Array.isArray(
      article.keywords
    )
      ? article.keywords.join(", ")
      : "";

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
    "article",
    true
  );

  setMeta(
    "og:site_name",
    "Apives",
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

  const canonicalUrl =
    `${window.location.origin}/blogs/${article.slug}`;

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
    canonicalUrl;
}

/*
=========================================================
  ARTICLE JSON-LD
=========================================================
*/

function updateArticleSchema(
  article: Article | null
) {
  if (
    typeof document === "undefined"
  ) {
    return;
  }

  document
    .getElementById(
      "apives-blog-post-schema"
    )
    ?.remove();

  if (!article) {
    return;
  }

  const script =
    document.createElement(
      "script"
    );

  script.id =
    "apives-blog-post-schema";

  script.type =
    "application/ld+json";

  script.textContent =
    JSON.stringify({
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
          `${window.location.origin}/blogs/${article.slug}`,
      },
    });

  document.head.appendChild(
    script
  );
}

/*
=========================================================
  INLINE MARKDOWN LINKS
=========================================================
*/

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
          className="post-inline-link"
        >
          {match[1]}
        </a>
      );
    }
  );
}

/*
=========================================================
  ARTICLE CONTENT
=========================================================
*/

function renderArticleContent(
  text: string
) {
  const safeText =
    typeof text === "string"
      ? text
      : "";

  const lines =
    safeText
      .trim()
      .split("\n");

  return lines.map(
    (line, index) => {
      const clean =
        line.trim();

      if (!clean) {
        return (
          <div
            key={`space-${index}`}
            className="post-content-space"
          />
        );
      }

      if (
        clean.startsWith("## ")
      ) {
        return (
          <h2
            key={`heading-${index}`}
            className="post-content-heading"
          >
            {renderInlineText(
              clean.slice(3),
              `heading-${index}`
            )}
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
            className="post-code"
          >
            {clean}
          </pre>
        );
      }

      return (
        <p
          key={`paragraph-${index}`}
          className="post-paragraph"
        >
          {renderInlineText(
            clean,
            `paragraph-${index}`
          )}
        </p>
      );
    }
  );
}

/*
=========================================================
  SOCIAL ICONS
=========================================================
*/

function FacebookMark() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M14 8h3V4h-3c-3.3 0-5 2-5 5v3H6v4h3v4h4v-4h3l1-4h-4V9c0-.7.3-1 1-1Z" />
    </svg>
  );
}

function LinkedInMark() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M5.1 7.2A2.1 2.1 0 1 0 5.1 3a2.1 2.1 0 0 0 0 4.2ZM3.2 9h3.8v11H3.2V9Zm6.1 0h3.6v1.5h.1c.5-.9 1.7-1.9 3.5-1.9 3.8 0 4.5 2.5 4.5 5.7V20h-3.8v-5c0-1.2 0-2.8-1.8-2.8s-2.1 1.3-2.1 2.7V20H9.3V9Z" />
    </svg>
  );
}

function RedditMark() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M21 12.1c0-1.2-1-2.2-2.2-2.2-.6 0-1.1.2-1.5.6-1.4-.9-3.1-1.5-5-1.6l.8-3.5 2.4.5a1.9 1.9 0 1 0 .4-1.4l-3-.6c-.4-.1-.8.2-.9.6l-1 4.4c-1.9.1-3.7.7-5.1 1.6-.4-.4-1-.6-1.5-.6A2.2 2.2 0 0 0 2 12.1c0 .8.4 1.5 1 1.9v.5c0 3.4 4 6.2 9 6.2s9-2.8 9-6.2V14c.6-.4 1-1.1 1-1.9ZM8.2 14.4a1.2 1.2 0 1 1 0-2.4 1.2 1.2 0 0 1 0 2.4Zm7.7 2.8c-1 .9-2.3 1.3-3.9 1.3s-2.9-.4-3.9-1.3a.7.7 0 0 1 1-1c.7.6 1.7.9 2.9.9s2.2-.3 2.9-.9a.7.7 0 0 1 1 1Zm0-2.8a1.2 1.2 0 1 1 0-2.4 1.2 1.2 0 0 1 0-2.4Z" />
    </svg>
  );
}

function WhatsAppMark() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M20.5 3.5A11.9 11.9 0 0 0 12.05 0C5.48 0 .14 5.34.14 11.91c0 2.1.55 4.15 1.6 5.96L.04 24l6.27-1.65a11.86 11.86 0 0 0 5.74 1.46h.01c6.56 0 11.9-5.34 11.9-11.91 0-3.18-1.23-6.17-3.46-8.4Zm-8.45 18.27h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.72.98.99-3.63-.23-.37a9.88 9.88 0 1 1 8.36 4.61Zm5.42-7.4c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.09 4.49.71.31 1.27.49 1.7.63.72.23 1.37.2 1.88.12.58-.09 1.76-.72 2.01-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z" />
    </svg>
  );
}

function XMark() {
  return (
    <span
      aria-hidden="true"
      style={{
        fontSize: 15,
        fontWeight: 800,
        lineHeight: 1,
      }}
    >
      𝕏
    </span>
  );
}

/*
=========================================================
  SHARE BUTTON
=========================================================
*/

function PostShareButton({
  label,
  children,
  onClick,
}: {
  label: string;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className="post-share-button"
      onClick={onClick}
    >
      {children}

      <span className="post-share-tooltip">
        {label}
      </span>
    </button>
  );
}

/*
=========================================================
  NORMALIZE BACKEND BLOG
=========================================================
*/

function normalizeBackendArticle(
  rawArticle: BackendBlog,
  fallbackSlug: string
): Article {
  const rawKeywords =
    Array.isArray(
      rawArticle.keywords
    )
      ? rawArticle.keywords
      : Array.isArray(
          rawArticle.tags
        )
      ? rawArticle.tags
      : [];

  const cleanKeywords =
    rawKeywords
      .map((keyword) =>
        String(keyword).trim()
      )
      .filter(Boolean);

  const rawFaq =
    Array.isArray(
      rawArticle.faq
    )
      ? rawArticle.faq
      : [];

  const cleanFaq =
    rawFaq
      .filter(
        (item) =>
          item &&
          typeof item ===
            "object" &&
          typeof item.question ===
            "string" &&
          typeof item.answer ===
            "string"
      )
      .map((item) => ({
        question:
          item.question.trim(),

        answer:
          item.answer.trim(),
      }));

  const normalizedAuthor =
    rawArticle.author &&
    typeof rawArticle.author ===
      "object"
      ? rawArticle.author
      : {};

  return {
    ...rawArticle,

    id:
      rawArticle.id ||
      rawArticle._id ||
      fallbackSlug,

    slug:
      rawArticle.slug ||
      fallbackSlug,

    title:
      typeof rawArticle.title ===
      "string"
        ? rawArticle.title
        : "",

    excerpt:
      typeof rawArticle.excerpt ===
      "string"
        ? rawArticle.excerpt
        : "",

    date:
      typeof rawArticle.date ===
      "string"
        ? rawArticle.date
        : typeof rawArticle.publishedAt ===
          "string"
        ? rawArticle.publishedAt
        : typeof rawArticle.createdAt ===
          "string"
        ? rawArticle.createdAt
        : "",

    keywords:
      cleanKeywords,

    content:
      typeof rawArticle.content ===
      "string"
        ? rawArticle.content
        : "",

    faq:
      cleanFaq,

    category:
      typeof rawArticle.category ===
      "string"
        ? rawArticle.category
        : "",

    author: {
      name:
        typeof normalizedAuthor.name ===
        "string"
          ? normalizedAuthor.name
          : "Priince Gupta",

      x:
        typeof normalizedAuthor.x ===
        "string"
          ? normalizedAuthor.x
          : "@priiincegupta",
    },
  } as Article;
}

/*
=========================================================
  BLOG POST
=========================================================
*/

export default function BlogPost({
  article: suppliedArticle,
  slug,
  onBack,
  onSelectArticle,
}: BlogPostProps) {
  const {
    slug: routeSlug,
  } = useParams<{
    slug: string;
  }>();

  const [
    sharing,
    setSharing,
  ] = useState(false);

  /*
  =======================================================
    CURRENT SLUG
  =======================================================
  */

  const currentSlug =
    slug || routeSlug || "";

  /*
  =======================================================
    FIRST: CHECK EXISTING STATIC ARTICLES

    Existing Apives articles continue to work
    exactly as before.
  =======================================================
  */

  const staticArticle =
    useMemo(() => {
      if (!currentSlug) {
        return null;
      }

      return (
        ARTICLES.find(
          (item) =>
            item.slug === currentSlug
        ) || null
      );
    }, [currentSlug]);

  /*
  =======================================================
    BACKEND ARTICLE STATE
  =======================================================
  */

  const [
    fetchedArticle,
    setFetchedArticle,
  ] = useState<Article | null>(
    null
  );

  const [
    articleLoading,
    setArticleLoading,
  ] = useState(
    !suppliedArticle &&
      !!currentSlug
  );

  /*
  =======================================================
    FETCH PUBLISHED ARTICLE
  =======================================================

    Backend route:

    GET /api/blogs/slug/:slug

    Because backend router is mounted at:

    /api/blogs

    actual endpoint becomes:

    /api/blogs/slug/:slug

    IMPORTANT:

    Backend is ALWAYS checked first.

    This ensures that if a blog exists both in
    ARTICLES and MongoDB, the latest MongoDB
    version is displayed on the details page.
  =======================================================
  */

  useEffect(() => {
    let cancelled = false;

    const loadArticle =
      async () => {
        /*
        ===================================================
          SUPPLIED ARTICLE
        ===================================================
        */

        if (suppliedArticle) {
          if (!cancelled) {
            setFetchedArticle(
              null
            );

            setArticleLoading(
              false
            );
          }

          return;
        }

        /*
        ===================================================
          NO SLUG
        ===================================================
        */

        if (!currentSlug) {
          if (!cancelled) {
            setFetchedArticle(
              null
            );

            setArticleLoading(
              false
            );
          }

          return;
        }

        /*
        ===================================================
          ALWAYS TRY BACKEND FIRST
        ===================================================
        */

        if (!cancelled) {
          setArticleLoading(
            true
          );

          setFetchedArticle(
            null
          );
        }

        try {
          /*
          Correct backend route:

          /api/blogs/slug/:slug

          NOT:

          /api/blogs/:slug
          */

          const endpoint =
            `${API_BASE}/api/blogs/slug/${encodeURIComponent(
              currentSlug
            )}`;

          console.log(
            "[Apives Blog] Loading latest article:",
            endpoint
          );

          /*
          Cache-busting query parameter makes sure
          a recently edited blog does not keep showing
          an old browser/CDN response.
          */

          const response =
            await fetch(
              `${endpoint}?_=${Date.now()}`,
              {
                method: "GET",

                headers: {
                  Accept:
                    "application/json",

                  "Cache-Control":
                    "no-cache",
                },

                cache: "no-store",
              }
            );

          /*
          =================================================
            BACKEND ARTICLE FOUND
          =================================================
          */

          if (response.ok) {
            const data =
              await response.json();

            /*
            Backend currently returns:

            {
              blog: {...}
            }

            Also supports:

            {
              data: {...}
            }

            OR directly:

            {...}
            */

            const rawArticle =
              data?.blog ||
              data?.data ||
              data;

            if (
              rawArticle &&
              typeof rawArticle ===
                "object"
            ) {
              const normalizedArticle =
                normalizeBackendArticle(
                  rawArticle as BackendBlog,
                  currentSlug
                );

              if (!cancelled) {
                console.log(
                  "[Apives Blog] Using latest MongoDB article:",
                  {
                    slug:
                      normalizedArticle.slug,

                    title:
                      normalizedArticle.title,

                    updatedAt:
                      (
                        rawArticle as BackendBlog
                      ).updatedAt,
                  }
                );

                setFetchedArticle(
                  normalizedArticle
                );

                setArticleLoading(
                  false
                );
              }

              return;
            }
          }

          /*
          =================================================
            BACKEND ARTICLE NOT FOUND

            Fall back to existing static ARTICLES.
          =================================================
          */

          if (!cancelled) {
            if (staticArticle) {
              console.log(
                "[Apives Blog] MongoDB article not found. Using static article:",
                currentSlug
              );
            } else {
              console.log(
                "[Apives Blog] Article not found:",
                currentSlug
              );
            }

            setFetchedArticle(
              null
            );

            setArticleLoading(
              false
            );
          }
        } catch (error) {
          /*
          =================================================
            API ERROR

            Fall back to static article without changing
            the existing UI or behavior.
          =================================================
          */

          console.error(
            "[Apives Blog] Failed to load MongoDB article:",
            error
          );

          if (!cancelled) {
            if (staticArticle) {
              console.log(
                "[Apives Blog] API unavailable. Falling back to static article:",
                currentSlug
              );
            }

            setFetchedArticle(
              null
            );

            setArticleLoading(
              false
            );
          }
        }
      };

    loadArticle();

    return () => {
      cancelled = true;
    };
  }, [
    currentSlug,
    suppliedArticle,
    staticArticle,
  ]);

  /*
  =======================================================
    FINAL ARTICLE

    Priority:

    suppliedArticle
    ↓
    fetchedArticle (MongoDB / API)
    ↓
    staticArticle (fallback)
  =======================================================
  */

  const article =
    suppliedArticle ||
    fetchedArticle ||
    staticArticle;

  /*
  =======================================================
    SEO
  =======================================================
  */

  useEffect(() => {
    updateArticleSEO(
      article
    );

    updateArticleSchema(
      article
    );

    window.scrollTo({
      top: 0,
      behavior: "auto",
    });

    return () => {
      updateArticleSchema(
        null
      );
    };
  }, [article]);

  /*
  =======================================================
    SHARE
  =======================================================
  */

  const shareUrl =
    article
      ? `${window.location.origin}/blogs/${article.slug}`
      : window.location.href;

  const encodedUrl =
    encodeURIComponent(
      shareUrl
    );

  const shareTitle =
    encodeURIComponent(
      article?.title ||
        "Apives Blog"
    );

  const nativeShare =
    async () => {
      if (!article) {
        return;
      }

      if (
        typeof navigator !==
          "undefined" &&
        typeof navigator.share ===
          "function"
      ) {
        try {
          setSharing(true);

          await navigator.share({
            title:
              article.title,

            text:
              article.excerpt,

            url:
              shareUrl,
          });
        } catch {
        } finally {
          setSharing(false);
        }

        return;
      }

      try {
        if (
          navigator.clipboard &&
          typeof navigator.clipboard
            .writeText ===
            "function"
        ) {
          await navigator.clipboard.writeText(
            shareUrl
          );

          setSharing(true);

          window.setTimeout(
            () => {
              setSharing(false);
            },
            1400
          );
        }
      } catch {
      }
    };

  const shareTo =
    (
      platform:
        | "email"
        | "facebook"
        | "reddit"
        | "x"
        | "linkedin"
        | "whatsapp"
    ) => {
      if (!article) {
        return;
      }

      let url = "";

      switch (platform) {
        case "email":
          url =
            `mailto:?subject=${shareTitle}&body=${encodeURIComponent(
              `${article.excerpt}\n\nRead more: ${shareUrl}`
            )}`;
          break;

        case "facebook":
          url =
            `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
          break;

        case "reddit":
          url =
            `https://www.reddit.com/submit?url=${encodedUrl}&title=${shareTitle}`;
          break;

        case "x":
          url =
            `https://twitter.com/intent/tweet?text=${shareTitle}&url=${encodedUrl}`;
          break;

        case "linkedin":
          url =
            `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
          break;

        case "whatsapp":
          url =
            `https://wa.me/?text=${encodeURIComponent(
              `${article.title}\n\n${shareUrl}`
            )}`;
          break;
      }

      if (url) {
        window.open(
          url,
          "_blank",
          "noopener,noreferrer"
        );
      }
    };

  /*
  =======================================================
    RELATED ARTICLES
  =======================================================
  */

  const relatedArticles =
    useMemo(() => {
      if (!article) {
        return [];
      }

      return ARTICLES.filter(
        (item) =>
          item.id !== article.id
      ).slice(0, 3);
    }, [article]);

  /*
  =======================================================
    NOT FOUND
  =======================================================
  */

  if (
    !articleLoading &&
    !article
  ) {
    return (
      <>
        <BlogPostStyles />

        <main className="post-root">
          <div className="post-not-found">
            <BackButton
              to="/blogs"
            />

            <h1>
              Article not found
            </h1>

            <p>
              The article you are
              looking for does not
              exist or may have been
              moved.
            </p>
          </div>
        </main>
      </>
    );
  }

  /*
  =======================================================
    LOADING
  =======================================================
  */

  if (!article) {
    return null;
  }

  /*
  =======================================================
    RENDER
  =======================================================
  */

  return (
    <>
      <BlogPostStyles />

      <main className="post-root">
        <div className="post-return-area">
          <BackButton
            to="/blogs"
          />
        </div>

        <article className="post-page">
          <header className="post-header">
            <div className="post-category">
              {(
                Array.isArray(
                  article.keywords
                )
                  ? article.keywords
                  : []
              )
                .slice(0, 2)
                .join(" · ")}
            </div>

            <h1 className="post-title">
              {article.title}
            </h1>

            <p className="post-excerpt">
              {article.excerpt}
            </p>

            <div className="post-meta">
              <span className="post-date">
                {formatBlogDate(
                  article.date
                )}
              </span>

              <span className="post-meta-dot">
                •
              </span>

              <span>
                Posted by{" "}
                <a
                  href="https://x.com/priiincegupta"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="post-author"
                >
                  @priiincegupta
                </a>
              </span>
            </div>

            <div className="post-share-row">
              <PostShareButton
                label="Email"
                onClick={() =>
                  shareTo("email")
                }
              >
                <Mail
                  size={16}
                />
              </PostShareButton>

              <PostShareButton
                label="Facebook"
                onClick={() =>
                  shareTo("facebook")
                }
              >
                <FacebookMark />
              </PostShareButton>

              <PostShareButton
                label="Reddit"
                onClick={() =>
                  shareTo("reddit")
                }
              >
                <RedditMark />
              </PostShareButton>

              <PostShareButton
                label="X"
                onClick={() =>
                  shareTo("x")
                }
              >
                <XMark />
              </PostShareButton>

              <PostShareButton
                label="LinkedIn"
                onClick={() =>
                  shareTo("linkedin")
                }
              >
                <LinkedInMark />
              </PostShareButton>

              <PostShareButton
                label="WhatsApp"
                onClick={() =>
                  shareTo("whatsapp")
                }
              >
                <WhatsAppMark />
              </PostShareButton>

              <PostShareButton
                label={
                  sharing
                    ? "Shared"
                    : "Share"
                }
                onClick={nativeShare}
              >
                {sharing ? (
                  <Check
                    size={16}
                  />
                ) : (
                  <Share2
                    size={16}
                  />
                )}
              </PostShareButton>
            </div>

            <div className="post-divider" />
          </header>

          <div className="post-content">
            {renderArticleContent(
              article.content
            )}
          </div>

          {(
            Array.isArray(
              article.faq
            )
              ? article.faq
              : []
          ).length > 0 && (
            <section className="post-faq">
              <h2>
                Frequently Asked
                Questions
              </h2>

              <p className="post-faq-intro">
                Practical answers to
                common questions
                developers have about
                this topic.
              </p>

              <div className="post-faq-list">
                {(
                  Array.isArray(
                    article.faq
                  )
                    ? article.faq
                    : []
                ).map(
                  (
                    item,
                    index
                  ) => (
                    <details
                      key={index}
                      className="post-faq-item"
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
                        {item.answer}
                      </p>
                    </details>
                  )
                )}
              </div>
            </section>
          )}

          {relatedArticles.length > 0 && (
            <section className="post-related">
              <h2>
                More from Apives
              </h2>

              <div className="post-related-list">
                {relatedArticles.map(
                  (related) => (
                    <button
                      key={
                        related.id
                      }
                      type="button"
                      className="post-related-item"
                      onClick={() => {
                        if (
                          onSelectArticle
                        ) {
                          onSelectArticle(
                            related
                          );

                          window.scrollTo({
                            top: 0,
                            behavior:
                              "auto",
                          });

                          return;
                        }

                        window.location.assign(
                          `/blogs/${related.slug}`
                        );
                      }}
                    >
                      <div>
                        <span className="post-related-date">
                          {
                            related.date
                          }
                        </span>

                        <h3>
                          {
                            related.title
                          }
                        </h3>

                        <p>
                          {
                            related.excerpt
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
          )}
        </article>
      </main>
    </>
  );
}

/*
=========================================================
  STYLES
  UI KEPT EXACTLY AS PROVIDED
=========================================================
*/

function BlogPostStyles() {
  return (
    <style>{`

      html {
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

      .post-root {
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

      .post-return-area {
        width: 100%;

        max-width: 900px;

        margin: 0 auto;

        padding:
          110px 24px
          0;
      }

      .post-page {
        width: 100%;

        max-width: 820px;

        margin: 0 auto;

        padding:
          28px 24px
          110px;
      }

      .post-header {
        text-align: center;

        padding-bottom: 25px;
      }

      .post-category {
        margin-bottom: 19px;

        color: ${GREEN};

        font-size: 10px;

        font-weight: 700;

        letter-spacing: .08em;

        text-transform: uppercase;
      }

      .post-title {
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

      .post-excerpt {
        max-width: 720px;

        margin:
          22px auto 0;

        color: #696969;

        font-size:
          clamp(16px, 2vw, 19px);

        line-height: 1.78;
      }

      .post-meta {
        display: flex;

        flex-wrap: wrap;

        align-items: center;

        justify-content: center;

        gap: 8px;

        margin-top: 19px;

        color: #555;

        font-size: 11px;
      }

      .post-date {
        color: ${GREEN};

        font-weight: 650;
      }

      .post-meta-dot {
        color: #333;
      }

      .post-author {
        color: ${GREEN};

        font-weight: 650;

        text-decoration: none;

        border-bottom:
          1px solid
          rgba(34,197,94,.22);
      }

      .post-author:hover {
        color: ${GREEN_SOFT};

        border-color:
          rgba(34,197,94,.65);
      }

      .post-share-row {
        display: flex;

        align-items: center;

        justify-content: center;

        gap: 7px;

        margin-top: 22px;
      }

      .post-share-button {
        position: relative;

        width: 39px;
        height: 39px;

        display: flex;

        align-items: center;
        justify-content: center;

        border:
          1px solid
          rgba(255,255,255,.09);

        border-radius: 50%;

        background:
          rgba(255,255,255,.035);

        backdrop-filter:
          blur(16px);

        -webkit-backdrop-filter:
          blur(16px);

        color: ${GREEN};

        cursor: pointer;

        box-shadow:
          inset
          0 1px 0
          rgba(255,255,255,.055);

        transition:
          transform .18s ease,
          background .18s ease,
          border-color .18s ease,
          color .18s ease;
      }

      .post-share-button svg {
        width: 16px;
        height: 16px;

        color: ${GREEN};
      }

      .post-share-button:hover {
        background:
          rgba(255,255,255,.065);

        border-color:
          rgba(34,197,94,.28);

        color: ${GREEN_SOFT};

        transform:
          translateY(-2px);
      }

      .post-share-button:hover svg {
        color: ${GREEN_SOFT};
      }

      .post-share-button:active {
        transform:
          scale(.91);
      }

      .post-share-tooltip {
        position: absolute;

        left: 50%;

        top:
          calc(100% + 9px);

        transform:
          translateX(-50%)
          translateY(-3px);

        padding:
          5px 8px;

        border:
          1px solid
          rgba(255,255,255,.08);

        border-radius: 6px;

        background: #050505;

        color: #858585;

        font-size: 9px;

        white-space: nowrap;

        opacity: 0;

        pointer-events: none;

        transition:
          opacity .15s ease,
          transform .15s ease;

        z-index: 30;
      }

      .post-share-button:hover
      .post-share-tooltip {
        opacity: 1;

        transform:
          translateX(-50%)
          translateY(0);
      }

      .post-divider {
        width: 100%;

        height: 1px;

        margin-top: 22px;

        background:
          rgba(255,255,255,.10);
      }

      .post-content {
        width: 100%;
      }

      .post-content-heading {
        margin:
          50px 0
          20px;

        color: #f5f5f5;

        font-size:
          clamp(24px, 3.2vw, 31px);

        line-height: 1.25;

        letter-spacing:
          -.8px;

        font-weight: 730;
      }

      .post-content
      .post-content-heading:first-child {
        margin-top: 23px;
      }

      .post-paragraph {
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

      .post-inline-link {
        color: ${GREEN};

        text-decoration:
          underline;

        text-decoration-color:
          rgba(34,197,94,.30);

        text-underline-offset:
          4px;

        transition:
          color .15s ease,
          text-decoration-color .15s ease;
      }

      .post-inline-link:hover {
        color: ${GREEN_SOFT};

        text-decoration-color:
          rgba(34,197,94,.8);
      }

      .post-content-space {
        height: 2px;
      }

      .post-code {
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

      .post-faq {
        margin-top: 75px;

        padding-top: 45px;

        border-top:
          1px solid
          rgba(255,255,255,.085);
      }

      .post-faq h2,
      .post-related h2 {
        margin: 0;

        color: #f5f5f5;

        font-size:
          clamp(25px, 3.2vw, 31px);

        line-height: 1.25;

        letter-spacing:
          -.8px;

        font-weight: 730;
      }

      .post-faq-intro {
        margin:
          11px 0 25px;

        color: #555;

        font-size: 13px;

        line-height: 1.75;
      }

      .post-faq-list {
        border-top:
          1px solid
          rgba(255,255,255,.07);
      }

      .post-faq-item {
        border-bottom:
          1px solid
          rgba(255,255,255,.07);
      }

      .post-faq-item summary {
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

      .post-faq-item
      summary::-webkit-details-marker {
        display: none;
      }

      .post-faq-item
      summary svg {
        flex-shrink: 0;

        color: #444;

        transition:
          transform .2s ease,
          color .2s ease;
      }

      .post-faq-item[open]
      summary svg {
        transform:
          rotate(90deg);

        color: ${GREEN};
      }

      .post-faq-item[open]
      summary {
        color: #fff;
      }

      .post-faq-item p {
        max-width: 740px;

        margin:
          -1px 0
          23px;

        color: #6b6b6b;

        font-size: 14px;

        line-height: 1.85;
      }

      .post-related {
        margin-top: 75px;

        padding-top: 45px;

        border-top:
          1px solid
          rgba(255,255,255,.085);
      }

      .post-related h2 {
        margin-bottom: 17px;
      }

      .post-related-list {
        width: 100%;
      }

      .post-related-item {
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

      .post-related-item > div {
        min-width: 0;
      }

      .post-related-date {
        display: block;

        margin-bottom: 7px;

        color: ${GREEN};

        font-size: 10px;

        font-weight: 650;
      }

      .post-related-item h3 {
        margin: 0;

        color: #c7c7c7;

        font-size:
          clamp(15px, 2vw, 19px);

        line-height: 1.4;

        letter-spacing:
          -.25px;

        font-weight: 620;

        transition:
          color .15s ease;
      }

      .post-related-item:hover h3 {
        color: #fff;
      }

      .post-related-item p {
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

      .post-related-item > svg {
        flex-shrink: 0;

        color: #333;

        transition:
          color .15s ease,
          transform .15s ease;
      }

      .post-related-item:hover > svg {
        color: ${GREEN};

        transform:
          translateX(3px);
      }

      .post-not-found {
        width: 100%;

        max-width: 700px;

        margin: 0 auto;

        padding:
          180px 24px
          120px;

        text-align: center;
      }

      .post-not-found h1 {
        margin: 0;

        color: #f5f5f5;

        font-size:
          clamp(34px, 6vw, 55px);

        letter-spacing:
          -2px;
      }

      .post-not-found p {
        margin-top: 16px;

        color: #555;

        font-size: 14px;

        line-height: 1.8;
      }

      @media (max-width: 640px) {
        .post-return-area {
          padding:
            76px 20px
            0;
        }

        .post-page {
          padding:
            25px 20px
            80px;
        }

        .post-category {
          margin-bottom: 16px;

          font-size: 9px;
        }

        .post-title {
          font-size:
            clamp(33px, 10vw, 45px);

          letter-spacing:
            -2px;
        }

        .post-excerpt {
          margin-top: 19px;

          font-size: 15px;

          line-height: 1.75;
        }

        .post-meta {
          margin-top: 17px;
        }

        .post-share-row {
          gap: 6px;

          margin-top: 20px;
        }

        .post-share-button {
          width: 38px;
          height: 38px;
        }

        .post-divider {
          margin-top: 18px;
        }

        .post-paragraph {
          font-size: 15.5px;

          line-height: 1.9;

          margin-bottom: 24px;
        }

        .post-content-heading {
          margin-top: 43px;

          margin-bottom: 18px;
        }

        .post-content
        .post-content-heading:first-child {
          margin-top: 22px;
        }

        .post-faq,
        .post-related {
          margin-top: 62px;

          padding-top: 35px;
        }

        .post-not-found {
          padding:
            140px 20px
            80px;
        }
      }

    `}</style>
  );
}