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

interface FAQ {
  question: string;
  answer: string;
}

interface BlogPost {
  id: string | number;
  _id?: string;

  slug: string;
  category?: string;

  title: string;
  excerpt: string;
  date: string;

  content?: string;

  keywords?: string[];
  faq?: FAQ[];

  author?: {
    name?: string;
    x?: string;
  };

  seo?: {
    title?: string;
    description?: string;
  };

  published?: boolean;

  createdAt?: string;
  updatedAt?: string;

  type: "post";
}

type StaticBlogItem = Article & {
  type: "article";
};

type BlogItem =
  | StaticBlogItem
  | BlogPost;


/* =========================================================
   CONSTANTS
========================================================= */

const GREEN = "#22c55e";

const ADMIN_EMAIL =
  "beatslevelone@gmail.com";

const PUBLISH_ROUTE =
  "/admin/blogs/publish";

/*
 * IMPORTANT
 *
 * The API is hosted separately from the frontend.
 *
 * Do NOT fall back to:
 *
 *     /api/blogs
 *
 * because that would request the frontend domain.
 *
 * Published blogs live here:
 *
 *     https://apives-3xrc.onrender.com/api/blogs
 *
 * VITE_API_URL can still override this if needed later.
 */

const DEFAULT_API_BASE_URL =
  "https://apives-3xrc.onrender.com";

const API_BASE_URL =
  (
    import.meta.env.VITE_API_URL ||
    DEFAULT_API_BASE_URL
  ).replace(/\/+$/, "");

const BLOGS_API_URL =
  `${API_BASE_URL}/api/blogs`;


/* =========================================================
   STATIC BLOG DATA
========================================================= */

const BLOG_ARTICLES: StaticBlogItem[] =
  ARTICLES.map((article) => ({
    ...article,
    type: "article" as const,
  }));


/*
 * Legacy posts.
 *
 * Keeping this so the existing UI/data structure
 * does not break if you add posts later.
 */

const POSTS: BlogPost[] = [];


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

    /*
     * PRIMARY:
     * mora_user.token
     */

    const moraUserRaw =
      localStorage.getItem(
        "mora_user"
      );

    if (moraUserRaw) {

      try {

        const moraUser =
          JSON.parse(
            moraUserRaw
          );

        const nestedToken =
          moraUser?.token ||
          moraUser?.accessToken ||
          moraUser?.authToken ||
          moraUser?.jwt;

        if (
          nestedToken &&
          String(
            nestedToken
          ).trim()
        ) {
          return String(
            nestedToken
          ).trim();
        }

      } catch {
        // Continue.
      }
    }


    /*
     * FALLBACK:
     * standalone token keys
     */

    const possibleKeys = [
      "token",
      "accessToken",
      "authToken",
      "jwt",
    ];


    for (
      const key of possibleKeys
    ) {

      const value =
        localStorage.getItem(
          key
        );

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


    if (
      parts.length !== 3
    ) {
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
      window.atob(
        base64
      );


    const decoded =
      JSON.parse(
        payload
      );


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
      "mora_user",
      "user",
      "currentUser",
      "loggedInUser",
      "authUser",
    ];


    for (
      const key of userKeys
    ) {

      const raw =
        localStorage.getItem(
          key
        );


      if (!raw) {
        continue;
      }


      try {

        const parsed =
          JSON.parse(
            raw
          );


        const email =
          parsed?.email ||
          parsed?.user?.email ||
          parsed?.data?.email ||
          parsed?.data?.user?.email;


        const normalized =
          normalizeEmail(
            email
          );


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

  const storedEmail =
    getEmailFromStoredUser();


  if (storedEmail) {
    return storedEmail;
  }


  const token =
    getToken();


  const jwtEmail =
    getEmailFromJWT(
      token
    );


  if (jwtEmail) {
    return jwtEmail;
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
   BLOG API HELPERS
========================================================= */

/*
 * Backend response currently expected:
 *
 * {
 *   blogs: [...],
 *   total: 10
 * }
 *
 * This helper also supports:
 *
 * [...]
 *
 * {
 *   data: {
 *     blogs: [...]
 *   }
 * }
 *
 * so a small backend response-shape change
 * does not break the blog page.
 */

async function fetchPublishedBlogs(
  signal?: AbortSignal
): Promise<BlogPost[]> {

  /*
   * Cache busting is intentional.
   *
   * After publishing a new article, browser/CDN
   * should not keep returning an older GET response.
   */

  const separator =
    BLOGS_API_URL.includes("?")
      ? "&"
      : "?";

  const requestUrl =
    `${BLOGS_API_URL}${separator}_=${Date.now()}`;


  const response =
    await fetch(
      requestUrl,
      {
        method: "GET",

        headers: {
          Accept:
            "application/json",

          "Cache-Control":
            "no-cache",
        },

        cache: "no-store",

        signal,
      }
    );


  if (!response.ok) {

    throw new Error(
      `Failed to fetch blogs (${response.status})`
    );
  }


  const data =
    await response.json();


  /*
   * Support all common backend response shapes.
   */

  let blogs: any[] = [];


  if (
    Array.isArray(data)
  ) {

    blogs = data;

  } else if (
    Array.isArray(
      data?.blogs
    )
  ) {

    blogs =
      data.blogs;

  } else if (
    Array.isArray(
      data?.data?.blogs
    )
  ) {

    blogs =
      data.data.blogs;

  } else if (
    Array.isArray(
      data?.data
    )
  ) {

    blogs =
      data.data;

  }


  return blogs
    .filter(
      (blog: any) =>
        blog &&
        blog.slug &&
        blog.title
    )
    /*
     * Only hide explicitly unpublished blogs.
     *
     * This means:
     *
     * published: true  -> SHOW
     * published: false -> HIDE
     * undefined         -> SHOW
     *
     * This is safer for compatibility with older
     * database documents.
     */
    .filter(
      (blog: any) =>
        blog.published !== false
    )
    .map(
      (blog: any) => ({
        ...blog,

        id:
          blog._id ||
          blog.id ||
          blog.slug,

        type:
          "post" as const,
      })
    )
    /*
     * Newest database articles first.
     *
     * Prefer createdAt when available.
     * Otherwise fall back to date.
     */
    .sort(
      (
        a: BlogPost,
        b: BlogPost
      ) => {

        const aTime =
          new Date(
            a.createdAt ||
            a.date ||
            0
          ).getTime();

        const bTime =
          new Date(
            b.createdAt ||
            b.date ||
            0
          ).getTime();

        return (
          bTime -
          aTime
        );
      }
    );
}


/* =========================================================
   BLOG NORMALIZATION
========================================================= */

function getBlogId(
  item: BlogItem
): string {

  if (
    typeof item.id ===
    "string"
  ) {
    return item.id;
  }


  return String(
    item.id
  );
}


/* ---------------------------------------------------------
   Search text
--------------------------------------------------------- */

function getSearchText(
  item: BlogItem
): string {

  const keywordText =
    Array.isArray(
      item.keywords
    )
      ? item.keywords.join(" ")
      : "";


  const categoryText =
    "category" in item
      ? item.category || ""
      : "";


  return [
    item.title,
    item.excerpt,
    item.date,
    categoryText,
    keywordText,
  ]
    .join(" ")
    .toLowerCase();
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


  /*
   * Database blogs.
   */

  const [
    serverBlogs,
    setServerBlogs,
  ] = useState<BlogPost[]>(
    []
  );


  /*
   * Loading only affects the small
   * loading message.
   *
   * Existing static articles remain
   * visible.
   */

  const [
    isLoadingBlogs,
    setIsLoadingBlogs,
  ] = useState(true);


  /*
   * API error is intentionally not
   * displayed as a big error page.
   *
   * Static articles remain available.
   */

  const [
    blogFetchError,
    setBlogFetchError,
  ] = useState(false);


  /* =======================================================
     LOAD BLOGS
  ======================================================= */

  const loadBlogs =
    async (
      signal?: AbortSignal
    ) => {

      setIsLoadingBlogs(
        true
      );


      setBlogFetchError(
        false
      );


      try {

        const blogs =
          await fetchPublishedBlogs(
            signal
          );


        if (
          !signal?.aborted
        ) {

          setServerBlogs(
            blogs
          );

          console.log(
            "[Apives] Published blogs loaded:",
            {
              api:
                BLOGS_API_URL,

              count:
                blogs.length,

              blogs:
                blogs.map(
                  (blog) => ({
                    id:
                      blog.id,

                    slug:
                      blog.slug,

                    title:
                      blog.title,

                    published:
                      blog.published,
                  })
                ),
            }
          );
        }

      } catch (error: any) {

        if (
          error?.name ===
          "AbortError"
        ) {
          return;
        }


        console.error(
          "[Apives] Failed to load MongoDB blogs:",
          error
        );


        if (
          !signal?.aborted
        ) {

          setBlogFetchError(
            true
          );

        }

      } finally {

        if (
          !signal?.aborted
        ) {

          setIsLoadingBlogs(
            false
          );

        }
      }
    };


  /* =======================================================
     SEO + ADMIN CHECK
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

            isAdmin:
              admin,

            hasToken:
              !!getToken(),
          }
        );


        setIsAdmin(
          admin
        );
      };


    checkAdmin();


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
     FETCH MONGODB BLOGS
  ======================================================= */

  useEffect(() => {

    const controller =
      new AbortController();


    loadBlogs(
      controller.signal
    );


    /*
     * If another part of the app publishes
     * or updates a blog, the list can refresh
     * without changing the UI.
     */

    const handleBlogUpdated =
      () => {

        if (
          controller.signal.aborted
        ) {
          return;
        }


        loadBlogs(
          controller.signal
        );
      };


    /*
     * Refresh when returning to the tab.
     *
     * This is useful after publishing in
     * another tab/window.
     */

    const handleVisibility =
      () => {

        if (
          document.visibilityState ===
          "visible"
        ) {

          loadBlogs(
            controller.signal
          );

        }
      };


    window.addEventListener(
      "blog-updated",
      handleBlogUpdated
    );


    document.addEventListener(
      "visibilitychange",
      handleVisibility
    );


    window.addEventListener(
      "focus",
      handleVisibility
    );


    return () => {

      controller.abort();


      window.removeEventListener(
        "blog-updated",
        handleBlogUpdated
      );


      document.removeEventListener(
        "visibilitychange",
        handleVisibility
      );


      window.removeEventListener(
        "focus",
        handleVisibility
      );

    };

  }, []);


  /* =======================================================
     COMBINE STATIC + DATABASE BLOGS
  ======================================================= */

  const blogItems =
    useMemo<BlogItem[]>(
      () => {

        /*
         * DB blogs are the source of truth
         * for dynamically published blogs.
         *
         * If a DB blog has the same slug as
         * a static article, the DB version wins.
         */

        const databaseSlugs =
          new Set(
            serverBlogs.map(
              (blog) =>
                String(
                  blog.slug
                )
                  .trim()
                  .toLowerCase()
            )
          );


        const staticItems =
          BLOG_ARTICLES.filter(
            (article) =>
              !databaseSlugs.has(
                String(
                  article.slug
                )
                  .trim()
                  .toLowerCase()
              )
          );


        /*
         * Keep newest MongoDB blogs first,
         * followed by existing static articles.
         */

        return [
          ...serverBlogs,
          ...staticItems,
          ...POSTS,
        ];

      },
      [
        serverBlogs,
      ]
    );


  /* =======================================================
     SEARCH
  ======================================================= */

  const filteredItems =
    useMemo(
      () => {

        const query =
          searchQuery
            .trim()
            .toLowerCase();


        if (!query) {

          return blogItems;

        }


        return blogItems.filter(
          (item) =>
            getSearchText(
              item
            ).includes(
              query
            )
        );

      },
      [
        searchQuery,
        blogItems,
      ]
    );


  /* =======================================================
     OPEN BLOG
  ======================================================= */

  const openItem = (
    item: BlogItem
  ) => {

    /*
     * Both MongoDB blogs and
     * existing articles use the same
     * detail route.
     *
     * This is important for:
     *
     * /blogs/rest-vs-graphql-vs-grpc
     *
     * and:
     *
     * /blogs/new-mongo-blog-slug
     */

    if (
      item.slug
    ) {

      navigate(
        `/blogs/${encodeURIComponent(
          item.slug
        )}`
      );

      return;
    }


    console.error(
      "[Apives] Blog has no slug:",
      item
    );

  };


  /* =======================================================
     OPEN PUBLISH
  ======================================================= */

  const openPublishPage =
    () => {

      const email =
        getLoggedInEmail();


      const adminEmail =
        ADMIN_EMAIL
          .trim()
          .toLowerCase();


      if (
        email !==
        adminEmail
      ) {

        console.error(
          "Publish access denied:",
          {
            loggedInEmail:
              email,

            expected:
              ADMIN_EMAIL,

            hasToken:
              !!getToken(),
          }
        );


        return;
      }


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
                  setSearchQuery(
                    ""
                  )
                }
                aria-label="Clear search"
              >

                <X
                  size={14}
                />

              </button>

            )}

          </div>


          {/* =================================================
              ADMIN PUBLISH BUTTON
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
                Publish Blog
              </span>

            </button>

          )}

        </section>


        {/* =================================================
            ARTICLES
        ================================================= */}

        <section className="articles-section">

          <div className="articles-top-line" />


          {/* -------------------------------------------------
              SMALL LOADING INDICATOR
          ------------------------------------------------- */}

          {isLoadingBlogs && (

            <div className="blogs-loading">

              <span className="loading-dot" />

              <span>
                Loading latest articles...
              </span>

            </div>

          )}


          {/* -------------------------------------------------
              SILENT API FALLBACK
          ------------------------------------------------- */}

          {!isLoadingBlogs &&
            blogFetchError &&
            serverBlogs.length === 0 && (

              <div className="blogs-api-status">

                <span>
                  Showing available articles
                </span>

              </div>

            )}


          {/* -------------------------------------------------
              BLOG LIST
          ------------------------------------------------- */}

          {filteredItems.length >
          0 ? (

            filteredItems.map(
              (item) => (

                <BlogListItem
                  key={`${item.type}-${getBlogId(
                    item
                  )}-${item.slug}`}
                  item={item}
                  onClick={() =>
                    openItem(
                      item
                    )
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
         LOADING
      ===================================================== */

      .blogs-loading {
        min-height: 34px;

        display: flex;

        align-items: center;

        justify-content: center;

        gap: 8px;

        color: #4c4c4c;

        font-size: 10px;

        letter-spacing: .02em;
      }


      .loading-dot {
        width: 5px;
        height: 5px;

        border-radius: 50%;

        background:
          ${GREEN};

        box-shadow:
          0 0 12px
          rgba(34,197,94,.4);

        animation:
          blogPulse
          1.1s ease-in-out
          infinite;
      }


      @keyframes blogPulse {

        0%,
        100% {
          opacity: .35;
          transform: scale(.8);
        }

        50% {
          opacity: 1;
          transform: scale(1);
        }

      }


      /* =====================================================
         API FALLBACK STATUS
      ===================================================== */

      .blogs-api-status {
        padding:
          10px 0 0;

        text-align: center;

        color: #3e3e3e;

        font-size: 9px;

        letter-spacing: .02em;
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

        -webkit-tap-highlight-color:
          transparent;

        transition:
          border-color .18s ease;
      }


      .blog-list-item:hover {
        border-bottom-color:
          rgba(255,255,255,.14);
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


      .empty-state p {
        margin: 0;
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


        .blogs-loading {
          min-height: 30px;
        }

      }

    `}</style>
  );
}