
import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Bold,
  Check,
  Code2,
  Eye,
  Heading2,
  Link as LinkIcon,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

const GREEN = "#22c55e";

const API_BASE =
  "https://apives-3xrc.onrender.com";

const ADMIN_EMAIL =
  "beatslevelone@gmail.com";

type ContentBlockType =
  | "paragraph"
  | "heading"
  | "bold"
  | "link"
  | "code";

interface ContentBlock {
  id: string;
  type: ContentBlockType;
  text: string;
  url?: string;
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const createId = () =>
  `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 9)}`;

const createBlock = (
  type: ContentBlockType = "paragraph"
): ContentBlock => ({
  id: createId(),
  type,
  text: "",
});

const createFAQ = (): FAQItem => ({
  id: createId(),
  question: "",
  answer: "",
});

/* =========================================================
   DATE HELPERS
========================================================= */

/*
  Internal date format:
    YYYY-MM-DD

  Example:
    2026-08-16

  Display format:
    August 16, 2026
*/

const getLocalDateString = (): string => {
  const now = new Date();

  const year =
    now.getFullYear();

  const month =
    String(
      now.getMonth() + 1
    ).padStart(2, "0");

  const day =
    String(
      now.getDate()
    ).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const normalizeDateInput = (
  value: any
): string => {
  if (!value) {
    return "";
  }

  if (
    typeof value === "string"
  ) {
    const trimmed =
      value.trim();

    /*
      Already YYYY-MM-DD
    */
    const directMatch =
      trimmed.match(
        /^(\d{4})-(\d{2})-(\d{2})/
      );

    if (directMatch) {
      return `${directMatch[1]}-${directMatch[2]}-${directMatch[3]}`;
    }

    /*
      Handle ISO dates such as:
      2026-08-16T00:00:00.000Z
    */
    const parsed =
      new Date(trimmed);

    if (
      !Number.isNaN(
        parsed.getTime()
      )
    ) {
      /*
        When Mongo returns an ISO date, use the
        calendar portion directly when available.
      */
      const iso =
        parsed.toISOString();

      return iso.slice(
        0,
        10
      );
    }
  }

  if (
    value instanceof Date &&
    !Number.isNaN(
      value.getTime()
    )
  ) {
    return value
      .toISOString()
      .slice(0, 10);
  }

  return "";
};

const formatDisplayDate = (
  value: string
): string => {
  const normalized =
    normalizeDateInput(
      value
    );

  if (!normalized) {
    return "";
  }

  const parts =
    normalized.split("-");

  if (
    parts.length !== 3
  ) {
    return value;
  }

  const year =
    Number(parts[0]);

  const month =
    Number(parts[1]);

  const day =
    Number(parts[2]);

  if (
    !year ||
    !month ||
    !day
  ) {
    return value;
  }

  const dateObject =
    new Date(
      year,
      month - 1,
      day
    );

  if (
    Number.isNaN(
      dateObject.getTime()
    )
  ) {
    return value;
  }

  return dateObject.toLocaleDateString(
    "en-US",
    {
      month: "long",
      day: "numeric",
      year: "numeric",
    }
  );
};

/* =========================================================
   STRING HELPERS
========================================================= */

const generateSlug = (
  value: string
): string => {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(
      /[\u0300-\u036f]/g,
      ""
    )
    .trim()
    .replace(
      /[^a-z0-9\s-]/g,
      ""
    )
    .replace(
      /\s+/g,
      "-"
    )
    .replace(
      /-+/g,
      "-"
    )
    .replace(
      /^-+|-+$/g,
      ""
    );
};

const cleanXHandle = (
  value: string
): string => {
  return value
    .trim()
    .replace(/^@+/, "")
    .replace(/\s+/g, "");
};

const normalizeExternalUrl = (
  value: string
): string => {
  const trimmed =
    value.trim();

  if (!trimmed) {
    return "";
  }

  if (
    /^https?:\/\//i.test(
      trimmed
    )
  ) {
    return trimmed;
  }

  if (
    /^mailto:/i.test(
      trimmed
    )
  ) {
    return trimmed;
  }

  return `https://${trimmed}`;
};

/* =========================================================
   JWT / AUTH HELPERS
========================================================= */

const getToken = (): string => {
  try {
    const directKeys = [
      "token",
      "accessToken",
      "authToken",
      "jwt",
    ];

    for (
      const key of directKeys
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
          JSON.parse(raw);

        const token =
          parsed?.token ||
          parsed?.accessToken ||
          parsed?.authToken ||
          parsed?.jwt ||
          parsed?.user?.token ||
          parsed?.user?.accessToken ||
          parsed?.user?.authToken ||
          parsed?.data?.token ||
          parsed?.data?.accessToken ||
          parsed?.data?.authToken;

        if (
          typeof token ===
            "string" &&
          token.trim()
        ) {
          return token.trim();
        }
      } catch {
        continue;
      }
    }

    return "";
  } catch {
    return "";
  }
};

const getUserEmailFromToken = (
  token: string | null
): string => {
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

    const payload =
      parts[1];

    if (!payload) {
      return "";
    }

    const normalized =
      payload
        .replace(/-/g, "+")
        .replace(/_/g, "/");

    const padded =
      normalized +
      "=".repeat(
        (4 -
          (normalized.length % 4)) %
          4
      );

    const decoded =
      JSON.parse(
        window.atob(padded)
      );

    const email =
      decoded?.email ||
      decoded?.user?.email ||
      decoded?.data?.email ||
      decoded?.data?.user?.email ||
      "";

    if (
      typeof email !==
      "string"
    ) {
      return "";
    }

    return email
      .trim()
      .toLowerCase();
  } catch {
    return "";
  }
};

const getStoredUserEmail =
  (): string => {
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
            JSON.parse(raw);

          const email =
            parsed?.email ||
            parsed?.user?.email ||
            parsed?.data?.email ||
            parsed?.data?.user?.email;

          if (
            typeof email ===
              "string" &&
            email.trim()
          ) {
            return email
              .trim()
              .toLowerCase();
          }
        } catch {
          continue;
        }
      }

      return "";
    } catch {
      return "";
    }
  };

const getUserEmail =
  (): string => {
    const token =
      getToken();

    const jwtEmail =
      getUserEmailFromToken(
        token
      );

    if (jwtEmail) {
      return jwtEmail;
    }

    return getStoredUserEmail();
  };

const clearAuthStorage =
  () => {
    const keys = [
      "token",
      "accessToken",
      "authToken",
      "jwt",
      "mora_user",
      "user",
      "currentUser",
      "loggedInUser",
      "authUser",
    ];

    for (
      const key of keys
    ) {
      try {
        localStorage.removeItem(
          key
        );
      } catch {
        // Ignore storage cleanup errors.
      }
    }

    try {
      window.dispatchEvent(
        new CustomEvent(
          "auth-change"
        )
      );
    } catch {
      // Ignore event errors.
    }
  };

/* =========================================================
   BLOG RESPONSE HELPERS
========================================================= */

const extractBlogFromResponse = (
  data: any
): any => {
  if (!data) {
    return null;
  }

  if (
    data.blog &&
    typeof data.blog ===
      "object"
  ) {
    return data.blog;
  }

  if (
    data.data?.blog &&
    typeof data.data.blog ===
      "object"
  ) {
    return data.data.blog;
  }

  if (
    data.data &&
    typeof data.data ===
      "object" &&
    (
      data.data.title ||
      data.data.slug ||
      data.data.content
    )
  ) {
    return data.data;
  }

  if (
    data.title ||
    data.slug ||
    data.content
  ) {
    return data;
  }

  return null;
};

const getBlogId = (
  blog: any
): string => {
  return String(
    blog?._id ||
      blog?.id ||
      blog?.blogId ||
      ""
  );
};

const getBlogAuthorX = (
  blog: any
): string => {
  const authorX =
    blog?.author?.x ||
    blog?.author?.twitter ||
    blog?.author?.twitterHandle ||
    blog?.authorX ||
    blog?.x ||
    "";

  if (
    typeof authorX !==
    "string"
  ) {
    return "@priiincegupta";
  }

  const clean =
    cleanXHandle(
      authorX
    );

  return clean
    ? `@${clean}`
    : "@priiincegupta";
};

const getBlogKeywords = (
  blog: any
): string => {
  if (
    Array.isArray(
      blog?.keywords
    )
  ) {
    return blog.keywords
      .map(
        (item: any) =>
          String(item).trim()
      )
      .filter(Boolean)
      .join(", ");
  }

  if (
    typeof blog?.keywords ===
    "string"
  ) {
    return blog.keywords;
  }

  return "";
};

const getBlogSeoTitle = (
  blog: any
): string => {
  return (
    blog?.seo?.title ||
    blog?.seoTitle ||
    ""
  );
};

const getBlogSeoDescription = (
  blog: any
): string => {
  return (
    blog?.seo?.description ||
    blog?.seoDescription ||
    ""
  );
};

/* =========================================================
   CONTENT SERIALIZATION
========================================================= */

const serializeContent =
  (
    blocks: ContentBlock[]
  ): string => {
    return blocks
      .filter(
        (block) =>
          block.text.trim()
      )
      .map((block) => {
        const text =
          block.text.trim();

        if (
          block.type ===
          "heading"
        ) {
          return `## ${text}`;
        }

        if (
          block.type ===
          "code"
        ) {
          const safeCode =
            block.text
              .replace(
                /```/g,
                "``\\`"
              )
              .trim();

          return `\`\`\`\n${safeCode}\n\`\`\``;
        }

        if (
          block.type ===
          "bold"
        ) {
          return `**${text}**`;
        }

        if (
          block.type ===
          "link"
        ) {
          const url =
            normalizeExternalUrl(
              block.url || ""
            );

          if (!url) {
            return text;
          }

          const safeText =
            text.replace(
              /\]/g,
              "\\]"
            );

          return `[${safeText}](${url})`;
        }

        return block.text.trim();
      })
      .join("\n\n");
};

/* =========================================================
   MARKDOWN PARSER
========================================================= */

/*
  Converts the existing Markdown stored in MongoDB
  back into editor blocks.

  Supported:
    ## Heading
    ### Heading
    **Bold**
    [Text](URL)
    ```code```
    normal paragraphs

  It intentionally keeps unknown Markdown as a paragraph
  rather than deleting content.
*/

const parseMarkdownToBlocks = (
  markdown: any
): ContentBlock[] => {
  if (
    typeof markdown !==
      "string" ||
    !markdown.trim()
  ) {
    return [
      createBlock(
        "paragraph"
      ),
    ];
  }

  const source =
    markdown
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n");

  const lines =
    source.split("\n");

  const blocks: ContentBlock[] =
    [];

  let paragraphLines: string[] =
    [];

  let codeLines: string[] =
    [];

  let inCode = false;

  const flushParagraph =
    () => {
      if (
        paragraphLines.length ===
        0
      ) {
        return;
      }

      const text =
        paragraphLines
          .join("\n")
          .trim();

      paragraphLines = [];

      if (!text) {
        return;
      }

      /*
        Whole-block bold:
          **Important text**
      */
      const boldMatch =
        text.match(
          /^\*\*(.+)\*\*$/s
        );

      if (boldMatch) {
        blocks.push({
          id: createId(),
          type: "bold",
          text:
            boldMatch[1].trim(),
        });

        return;
      }

      /*
        Whole-block link:
          [Example](https://example.com)
      */
      const linkMatch =
        text.match(
          /^\[([^\]]+)\]\((https?:\/\/[^)]+|mailto:[^)]+)\)$/i
        );

      if (linkMatch) {
        blocks.push({
          id: createId(),
          type: "link",
          text:
            linkMatch[1].trim(),
          url:
            linkMatch[2].trim(),
        });

        return;
      }

      /*
        Heading accidentally passed here.
      */
      const headingMatch =
        text.match(
          /^#{1,6}\s+(.+)$/
        );

      if (headingMatch) {
        blocks.push({
          id: createId(),
          type: "heading",
          text:
            headingMatch[1].trim(),
        });

        return;
      }

      blocks.push({
        id: createId(),
        type: "paragraph",
        text,
      });
    };

  const flushCode =
    () => {
      const code =
        codeLines.join("\n");

      codeLines = [];

      blocks.push({
        id: createId(),
        type: "code",
        text: code,
      });
    };

  for (
    let index = 0;
    index < lines.length;
    index += 1
  ) {
    const line =
      lines[index];

    /*
      Code fence.
    */
    if (
      line.trim().startsWith(
        "```"
      )
    ) {
      if (inCode) {
        flushCode();
        inCode = false;
      } else {
        flushParagraph();
        inCode = true;
      }

      continue;
    }

    if (inCode) {
      codeLines.push(line);
      continue;
    }

    /*
      Blank line ends a paragraph.
    */
    if (!line.trim()) {
      flushParagraph();
      continue;
    }

    /*
      Headings.

      Supports:
        # Heading
        ## Heading
        ### Heading
        etc.

      Existing serializer creates ## headings.
    */
    const headingMatch =
      line.match(
        /^#{1,6}\s+(.+)$/
      );

    if (headingMatch) {
      flushParagraph();

      blocks.push({
        id: createId(),
        type: "heading",
        text:
          headingMatch[1].trim(),
      });

      continue;
    }

    /*
      Whole line bold.
    */
    const boldMatch =
      line.match(
        /^\*\*(.+)\*\*$/
      );

    if (boldMatch) {
      flushParagraph();

      blocks.push({
        id: createId(),
        type: "bold",
        text:
          boldMatch[1].trim(),
      });

      continue;
    }

    /*
      Whole line Markdown link.
    */
    const linkMatch =
      line.match(
        /^([^]+)\](https?:\/\/[^)]+|mailto:[^)]+)$/i
      );

    if (linkMatch) {
      flushParagraph();

      blocks.push({
        id: createId(),
        type: "link",
        text:
          linkMatch[1].trim(),
        url:
          linkMatch[2].trim(),
      });

      continue;
    }

    paragraphLines.push(
      line
    );
  }

  if (inCode) {
    flushCode();
  }

  flushParagraph();

  if (
    blocks.length === 0
  ) {
    return [
      createBlock(
        "paragraph"
      ),
    ];
  }

  return blocks;
};

/* =========================================================
   COMPONENT
========================================================= */

export default function PublishBlog() {
  const navigate =
    useNavigate();

  const params =
    useParams<{
      id?: string;
    }>();

  /*
    Route:
      /admin/blogs/publish
      /admin/blogs/edit/:id
  */

  const editId =
    params.id || "";

  const isEditMode =
    !!editId;

  /* ================= ADMIN ACCESS ================= */

  const [
    checkingAccess,
    setCheckingAccess,
  ] = useState(true);

  const [
    isAdmin,
    setIsAdmin,
  ] = useState(false);

  useEffect(() => {
    let mounted = true;

    const checkAccess =
      () => {
        const currentToken =
          getToken();

        const email =
          getUserEmail();

        const adminEmail =
          ADMIN_EMAIL
            .trim()
            .toLowerCase();

        const authorized =
          !!currentToken &&
          email === adminEmail;

        console.log(
          "[Apives] Blog access:",
          {
            hasToken:
              !!currentToken,

            email,

            adminEmail,

            isAdmin:
              authorized,

            editMode:
              isEditMode,

            editId,
          }
        );

        if (!authorized) {
          if (mounted) {
            setIsAdmin(false);
            setCheckingAccess(false);
          }

          navigate(
            "/access",
            {
              replace: true,
            }
          );

          return;
        }

        if (mounted) {
          setIsAdmin(true);
          setCheckingAccess(false);
        }
      };

    checkAccess();

    window.addEventListener(
      "auth-change",
      checkAccess
    );

    window.addEventListener(
      "storage",
      checkAccess
    );

    return () => {
      mounted = false;

      window.removeEventListener(
        "auth-change",
        checkAccess
      );

      window.removeEventListener(
        "storage",
        checkAccess
      );
    };
  }, [
    navigate,
    editId,
    isEditMode,
  ]);

  /* =====================================================
     PREVIEW GLOBAL HEADER CONTROL
  ===================================================== */

  const [preview, setPreview] =
    useState(false);

  useEffect(() => {
    const body =
      document.body;

    if (preview) {
      body.classList.add(
        "publish-preview-active"
      );
    } else {
      body.classList.remove(
        "publish-preview-active"
      );
    }

    return () => {
      body.classList.remove(
        "publish-preview-active"
      );
    };
  }, [preview]);

  /* ================= BASIC ================= */

  const [category, setCategory] =
    useState("");

  const [title, setTitle] =
    useState("");

  const [excerpt, setExcerpt] =
    useState("");

  const [slug, setSlug] =
    useState("");

  const [date, setDate] =
    useState(
      getLocalDateString()
    );

  const [authorX, setAuthorX] =
    useState(
      "@priiincegupta"
    );

  const [keywords, setKeywords] =
    useState("");

  /* ================= CONTENT ================= */

  const [content, setContent] =
    useState<ContentBlock[]>([
      createBlock("paragraph"),
    ]);

  /* ================= FAQ ================= */

  const [faq, setFaq] =
    useState<FAQItem[]>([]);

  /* ================= SEO ================= */

  const [seoTitle, setSeoTitle] =
    useState("");

  const [
    seoDescription,
    setSeoDescription,
  ] = useState("");

  /* ================= UI ================= */

  const [
    publishing,
    setPublishing,
  ] = useState(false);

  const [
    published,
    setPublished,
  ] = useState(false);

  const [error, setError] =
    useState("");

  const [
    loadingBlog,
    setLoadingBlog,
  ] = useState(
    isEditMode
  );

  const [
    loadedBlogId,
    setLoadedBlogId,
  ] = useState("");

  /* =====================================================
     LOAD EXISTING BLOG
  ===================================================== */

  useEffect(() => {
    let mounted = true;

    /*
      Publish page does not need a GET.
    */
    if (!isEditMode) {
      setLoadingBlog(false);
      setLoadedBlogId("");
      return;
    }

    if (!editId) {
      setLoadingBlog(false);
      return;
    }

    const loadBlog =
      async () => {
        setLoadingBlog(true);
        setError("");

        const authToken =
          getToken();

        const email =
          getUserEmail();

        const adminEmail =
          ADMIN_EMAIL
            .trim()
            .toLowerCase();

        if (
          !authToken ||
          email !== adminEmail
        ) {
          if (mounted) {
            setError(
              "Authentication session is invalid or you are not authorized to edit blogs."
            );

            setLoadingBlog(false);
          }

          clearAuthStorage();

          navigate(
            "/access",
            {
              replace: true,
            }
          );

          return;
        }

        try {
          console.log(
            "[Apives] Loading blog:",
            editId
          );

          const response =
            await fetch(
              `${API_BASE}/api/blogs/${encodeURIComponent(
                editId
              )}`,
              {
                method:
                  "GET",

                headers: {
                  Accept:
                    "application/json",

                  Authorization:
                    `Bearer ${authToken}`,
                },
              }
            );

          const responseText =
            await response.text();

          let data: any =
            {};

          if (
            responseText
          ) {
            try {
              data =
                JSON.parse(
                  responseText
                );
            } catch {
              data = {
                raw:
                  responseText,
              };
            }
          }

          if (
            response.status ===
            401
          ) {
            clearAuthStorage();

            if (mounted) {
              setError(
                "Your authentication session has expired. Please sign in again."
              );

              setLoadingBlog(false);
            }

            navigate(
              "/access",
              {
                replace: true,
              }
            );

            return;
          }

          if (
            response.status ===
            403
          ) {
            throw new Error(
              data?.message ||
                "You are not authorized to edit blogs."
            );
          }

          if (
            response.status ===
            404
          ) {
            throw new Error(
              data?.message ||
                "Blog not found."
            );
          }

          if (
            !response.ok
          ) {
            throw new Error(
              data?.message ||
                data?.error ||
                data?.raw ||
                `Failed to load blog. Server returned ${response.status}.`
            );
          }

          const blog =
            extractBlogFromResponse(
              data
            );

          if (!blog) {
            throw new Error(
              "The server did not return a valid blog."
            );
          }

          if (
            !mounted
          ) {
            return;
          }

          console.log(
            "[Apives] Loaded blog:",
            blog
          );

          /*
            HERO
          */

          setCategory(
            String(
              blog?.category ||
                blog?.eyebrow ||
                ""
            )
          );

          setTitle(
            String(
              blog?.title ||
                ""
            )
          );

          setExcerpt(
            String(
              blog?.excerpt ||
                blog?.description ||
                ""
            )
          );

          /*
            SLUG
          */

          setSlug(
            String(
              blog?.slug ||
                ""
            )
          );

          /*
            DATE

            Internal state remains:
              YYYY-MM-DD
          */

          setDate(
            normalizeDateInput(
              blog?.date ||
                blog?.publishedAt ||
                blog?.createdAt
            ) ||
              getLocalDateString()
          );

          /*
            AUTHOR
          */

          setAuthorX(
            getBlogAuthorX(
              blog
            )
          );

          /*
            KEYWORDS
          */

          setKeywords(
            getBlogKeywords(
              blog
            )
          );

          /*
            CONTENT

            Existing MongoDB content is Markdown.
            Parse it back to blocks.
          */

          const parsedBlocks =
            parseMarkdownToBlocks(
              blog?.content ||
                blog?.body ||
                ""
            );

          setContent(
            parsedBlocks
          );

          /*
            FAQ
          */

          const rawFAQ =
            Array.isArray(
              blog?.faq
            )
              ? blog.faq
              : Array.isArray(
                    blog?.faqs
                  )
                ? blog.faqs
                : [];

          const loadedFAQ =
            rawFAQ
              .map(
                (
                  item: any
                ) => ({
                  id: createId(),

                  question:
                    String(
                      item?.question ||
                        ""
                    ),

                  answer:
                    String(
                      item?.answer ||
                        ""
                    ),
                })
              );

          setFaq(
            loadedFAQ
          );

          /*
            SEO
          */

          setSeoTitle(
            getBlogSeoTitle(
              blog
            )
          );

          setSeoDescription(
            getBlogSeoDescription(
              blog
            )
          );

          setLoadedBlogId(
            getBlogId(
              blog
            ) || editId
          );

          setLoadingBlog(false);
        } catch (
          err: any
        ) {
          console.error(
            "[Apives] Load blog error:",
            err
          );

          if (mounted) {
            setError(
              err?.message ||
                "Something went wrong while loading the blog."
            );

            setLoadingBlog(false);
          }
        }
      };

    loadBlog();

    return () => {
      mounted = false;
    };
  }, [
    editId,
    isEditMode,
    navigate,
  ]);

  /* =====================================================
     AUTO SLUG
  ===================================================== */

  const handleTitleChange = (
    value: string
  ) => {
    const oldGeneratedSlug =
      generateSlug(title);

    setTitle(value);

    if (
      !slug ||
      slug === oldGeneratedSlug
    ) {
      setSlug(
        generateSlug(value)
      );
    }

    if (!seoTitle) {
      setSeoTitle(value);
    }
  };

  /* =====================================================
     CONTENT
  ===================================================== */

  const updateBlock = (
    id: string,
    field:
      | "text"
      | "url",
    value: string
  ) => {
    setContent((prev) =>
      prev.map((block) =>
        block.id === id
          ? {
              ...block,
              [field]:
                value,
            }
          : block
      )
    );
  };

  const addBlock = (
    type: ContentBlockType
  ) => {
    setContent((prev) => [
      ...prev,
      createBlock(type),
    ]);
  };

  const removeBlock = (
    id: string
  ) => {
    setContent((prev) => {
      if (
        prev.length === 1
      ) {
        return [
          createBlock(
            "paragraph"
          ),
        ];
      }

      return prev.filter(
        (block) =>
          block.id !== id
      );
    });
  };

  const moveBlock = (
    index: number,
    direction: -1 | 1
  ) => {
    setContent((prev) => {
      const nextIndex =
        index + direction;

      if (
        nextIndex < 0 ||
        nextIndex >=
          prev.length
      ) {
        return prev;
      }

      const copy = [
        ...prev,
      ];

      [
        copy[index],
        copy[nextIndex],
      ] = [
        copy[nextIndex],
        copy[index],
      ];

      return copy;
    });
  };

  /* =====================================================
     FAQ
  ===================================================== */

  const addFAQ = () => {
    setFaq((prev) => [
      ...prev,
      createFAQ(),
    ]);
  };

  const updateFAQ = (
    id: string,
    field:
      | "question"
      | "answer",
    value: string
  ) => {
    setFaq((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]:
                value,
            }
          : item
      )
    );
  };

  const removeFAQ = (
    id: string
  ) => {
    setFaq((prev) =>
      prev.filter(
        (item) =>
          item.id !== id
      )
    );
  };

  /* =====================================================
     FINAL CONTENT
  ===================================================== */

  const finalContent =
    useMemo(() => {
      return serializeContent(
        content
      );
    }, [content]);

  /* =====================================================
     VALIDATION
  ===================================================== */

  const validate = () => {
    if (!isAdmin) {
      return "You are not authorized to publish blogs.";
    }

    if (!category.trim()) {
      return "Please enter the green eyebrow text.";
    }

    if (!title.trim()) {
      return "Please enter a blog title.";
    }

    if (!excerpt.trim()) {
      return "Please enter the short description.";
    }

    if (!slug.trim()) {
      return "Please enter a slug.";
    }

    if (!generateSlug(slug)) {
      return "Please enter a valid slug.";
    }

    if (!authorX.trim()) {
      return "Please enter the author's X handle.";
    }

    if (
      !cleanXHandle(
        authorX
      )
    ) {
      return "Please enter a valid X handle.";
    }

    if (!finalContent.trim()) {
      return "Please add some article content.";
    }

    if (!date) {
      return "Please select a publication date.";
    }

    return "";
  };

  /* =====================================================
     DISPATCH BLOG UPDATED EVENT
  ===================================================== */

  const dispatchBlogUpdated =
    (
      blogId: string,
      blogSlug: string,
      action:
        | "published"
        | "updated"
    ) => {
      try {
        window.dispatchEvent(
          new CustomEvent(
            "blog-updated",
            {
              detail: {
                id:
                  blogId ||
                  editId ||
                  "",

                blogId:
                  blogId ||
                  editId ||
                  "",

                slug:
                  blogSlug ||
                  slug ||
                  "",

                action,
              },
            }
          )
        );

        /*
          Also keep a generic storage signal so other
          tabs/pages can react to the update.
        */

        try {
          localStorage.setItem(
            "apives_blog_updated",
            JSON.stringify({
              id:
                blogId ||
                editId ||
                "",

              slug:
                blogSlug ||
                slug ||
                "",

              action,

              timestamp:
                Date.now(),
            })
          );
        } catch {
          // Ignore localStorage event errors.
        }
      } catch {
        // Ignore event errors.
      }
    };

  /* =====================================================
     SAVE / PUBLISH
  ===================================================== */

  const handlePublish =
    async () => {
      if (publishing) {
        return;
      }

      setError("");
      setPublished(false);

      /*
        Always re-check current auth.
      */

      const authToken =
        getToken();

      const email =
        getUserEmail();

      const adminEmail =
        ADMIN_EMAIL
          .trim()
          .toLowerCase();

      if (
        !authToken ||
        email !== adminEmail
      ) {
        setError(
          "Authentication session is invalid or you are not authorized to publish blogs."
        );

        clearAuthStorage();

        navigate(
          "/access",
          {
            replace: true,
          }
        );

        return;
      }

      const validationError =
        validate();

      if (validationError) {
        setError(
          validationError
        );

        return;
      }

      /*
        In edit mode the actual MongoDB ID is required.
      */

      if (
        isEditMode &&
        !editId
      ) {
        setError(
          "Blog ID is missing. Please open the editor from the blog edit page."
        );

        return;
      }

      setPublishing(true);

      try {
        /* ---------------------------------------------
           KEYWORDS
        --------------------------------------------- */

        const cleanedKeywords =
          keywords
            .split(",")
            .map((item) =>
              item.trim()
            )
            .filter(Boolean)
            .filter(
              (
                item,
                index,
                array
              ) =>
                array.indexOf(
                  item
                ) === index
            );

        /* ---------------------------------------------
           FAQ
        --------------------------------------------- */

        const cleanedFAQ =
          faq
            .filter(
              (item) =>
                item.question.trim() &&
                item.answer.trim()
            )
            .map((item) => ({
              question:
                item.question.trim(),

              answer:
                item.answer.trim(),
            }));

        /* ---------------------------------------------
           AUTHOR
        --------------------------------------------- */

        const cleanAuthorX =
          cleanXHandle(
            authorX
          );

        /* ---------------------------------------------
           SLUG
        --------------------------------------------- */

        const cleanSlug =
          generateSlug(
            slug
          );

        /* ---------------------------------------------
           SEO
        --------------------------------------------- */

        const cleanSeoTitle =
          seoTitle.trim() ||
          title.trim();

        const cleanSeoDescription =
          seoDescription.trim() ||
          excerpt.trim();

        /* ---------------------------------------------
           PAYLOAD
        --------------------------------------------- */

        const payload = {
          category:
            category.trim(),

          title:
            title.trim(),

          excerpt:
            excerpt.trim(),

          slug:
            cleanSlug,

          /*
            IMPORTANT:
            Always send YYYY-MM-DD internally.
          */

          date:
            normalizeDateInput(
              date
            ),

          author: {
            x: `@${cleanAuthorX}`,
          },

          keywords:
            cleanedKeywords,

          content:
            finalContent,

          faq:
            cleanedFAQ,

          seo: {
            title:
              cleanSeoTitle,

            description:
              cleanSeoDescription,
          },

          published: true,
        };

        console.log(
          `[Apives] ${
            isEditMode
              ? "Updating"
              : "Publishing"
          } blog:`,
          {
            id:
              editId,

            slug:
              payload.slug,

            contentLength:
              payload.content.length,

            faqCount:
              payload.faq.length,

            keywordCount:
              payload.keywords.length,

            date:
              payload.date,
          }
        );

        /* ---------------------------------------------
           API REQUEST
        --------------------------------------------- */

        const endpoint =
          isEditMode
            ? `${API_BASE}/api/blogs/${encodeURIComponent(
                editId
              )}`
            : `${API_BASE}/api/blogs`;

        const method =
          isEditMode
            ? "PUT"
            : "POST";

        const response =
          await fetch(
            endpoint,
            {
              method,

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${authToken}`,

                Accept:
                  "application/json",
              },

              body:
                JSON.stringify(
                  payload
                ),
            }
          );

        /* ---------------------------------------------
           RESPONSE
        --------------------------------------------- */

        let data: any =
          {};

        const responseText =
          await response.text();

        if (
          responseText
        ) {
          try {
            data =
              JSON.parse(
                responseText
              );
          } catch {
            data = {
              raw:
                responseText,
            };
          }
        }

        /* ---------------------------------------------
           AUTH EXPIRED
        --------------------------------------------- */

        if (
          response.status ===
          401
        ) {
          clearAuthStorage();

          setError(
            "Your authentication session has expired. Please sign in again."
          );

          navigate(
            "/access",
            {
              replace: true,
            }
          );

          return;
        }

        /* ---------------------------------------------
           FORBIDDEN
        --------------------------------------------- */

        if (
          response.status ===
          403
        ) {
          throw new Error(
            data?.message ||
              "You are not authorized to modify blogs."
          );
        }

        /* ---------------------------------------------
           NOT FOUND
        --------------------------------------------- */

        if (
          response.status ===
          404
        ) {
          throw new Error(
            data?.message ||
              "Blog not found."
          );
        }

        /* ---------------------------------------------
           DUPLICATE / CONFLICT
        --------------------------------------------- */

        if (
          response.status ===
          409
        ) {
          throw new Error(
            data?.message ||
              "A blog with this slug already exists. Please choose another slug."
          );
        }

        /* ---------------------------------------------
           OTHER API ERRORS
        --------------------------------------------- */

        if (
          !response.ok
        ) {
          throw new Error(
            data?.message ||
              data?.error ||
              data?.raw ||
              `Failed to ${
                isEditMode
                  ? "update"
                  : "publish"
              } blog. Server returned ${response.status}.`
          );
        }

        /* ---------------------------------------------
           SUCCESS BLOG
        --------------------------------------------- */

        const returnedBlog =
          extractBlogFromResponse(
            data
          );

        const publishedSlug =
          returnedBlog?.slug ||
          data?.blog?.slug ||
          data?.data?.blog?.slug ||
          data?.data?.slug ||
          data?.slug ||
          cleanSlug;

        const returnedBlogId =
          getBlogId(
            returnedBlog
          ) ||
          data?.blog?._id ||
          data?.blog?.id ||
          data?.data?.blog?._id ||
          data?.data?.blog?.id ||
          editId;

        if (
          !publishedSlug
        ) {
          throw new Error(
            `${
              isEditMode
                ? "Blog was updated"
                : "Blog was published"
            }, but the server did not return a valid slug.`
          );
        }

        /*
          Event fires AFTER successful DB operation.
        */

        dispatchBlogUpdated(
          String(
            returnedBlogId ||
              ""
          ),
          String(
            publishedSlug
          ),
          isEditMode
            ? "updated"
            : "published"
        );

        setPublished(true);

        /*
          Keep existing behavior:
          show success briefly and then open
          the actual published article.
        */

        window.setTimeout(
          () => {
            navigate(
              `/blogs/${encodeURIComponent(
                publishedSlug
              )}`
            );
          },
          900
        );
      } catch (
        err: any
      ) {
        console.error(
          `${
            isEditMode
              ? "Update"
              : "Publish"
          } blog error:`,
          err
        );

        setError(
          err?.message ||
            `Something went wrong while ${
              isEditMode
                ? "updating"
                : "publishing"
            } the blog.`
        );
      } finally {
        setPublishing(
          false
        );
      }
    };

  /* =====================================================
     ACCESS CHECK
  ===================================================== */

  if (
    checkingAccess ||
    !isAdmin
  ) {
    return (
      <>
        <PublishStyles />

        <main className="access-loading">
          <div className="access-loading-box">
            <div className="access-loader" />

            <span>
              Checking access...
            </span>
          </div>
        </main>
      </>
    );
  }

  /* =====================================================
     EDIT BLOG LOADING
  ===================================================== */

  if (
    isEditMode &&
    loadingBlog
  ) {
    return (
      <>
        <PublishStyles />

        <main className="access-loading">
          <div className="access-loading-box">
            <div className="access-loader" />

            <span>
              Loading blog...
            </span>
          </div>
        </main>
      </>
    );
  }

  /* =====================================================
     PREVIEW
  ===================================================== */

  if (preview) {
    return (
      <>
        <PublishStyles />

        <main className="publish-preview-root">
          <div className="preview-topbar">
            <button
              type="button"
              onClick={() =>
                setPreview(
                  false
                )
              }
              className="editor-back-button"
            >
              <ArrowLeft
                size={15}
              />

              Back to editor
            </button>

            <span className="preview-label">
              Preview
            </span>

            <button
              type="button"
              onClick={
                handlePublish
              }
              disabled={
                publishing
              }
              className="publish-button small"
            >
              {publishing ? (
                isEditMode
                  ? "Saving..."
                  : "Publishing..."
              ) : (
                <>
                  <Save
                    size={14}
                  />

                  {isEditMode
                    ? "Save Changes"
                    : "Publish"}
                </>
              )}
            </button>
          </div>

          <article className="preview-article">
            <div className="preview-category">
              {category ||
                "BLOG CATEGORY"}
            </div>

            <h1>
              {title ||
                "Your blog title"}
            </h1>

            <p className="preview-excerpt">
              {excerpt ||
                "Your short description will appear here."}
            </p>

            <div className="preview-meta">
              <span>
                {formatDisplayDate(
                  date
                ) ||
                  date}
              </span>

              <span>
                •
              </span>

              <span>
                Posted by{" "}

                <a
                  href={`https://x.com/${cleanXHandle(
                    authorX
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {authorX ||
                    "@author"}
                </a>
              </span>
            </div>

            <div className="preview-divider" />

            <div className="preview-content">
              {content.map(
                (block) => {
                  if (
                    !block.text.trim()
                  ) {
                    return null;
                  }

                  if (
                    block.type ===
                    "heading"
                  ) {
                    return (
                      <h2
                        key={
                          block.id
                        }
                      >
                        {
                          block.text
                        }
                      </h2>
                    );
                  }

                  if (
                    block.type ===
                    "code"
                  ) {
                    return (
                      <pre
                        key={
                          block.id
                        }
                      >
                        <code>
                          {
                            block.text
                          }
                        </code>
                      </pre>
                    );
                  }

                  if (
                    block.type ===
                    "bold"
                  ) {
                    return (
                      <p
                        key={
                          block.id
                        }
                      >
                        <strong>
                          {
                            block.text
                          }
                        </strong>
                      </p>
                    );
                  }

                  if (
                    block.type ===
                    "link"
                  ) {
                    const previewUrl =
                      normalizeExternalUrl(
                        block.url ||
                          ""
                      );

                    if (
                      !previewUrl
                    ) {
                      return (
                        <p
                          key={
                            block.id
                          }
                        >
                          {
                            block.text
                          }
                        </p>
                      );
                    }

                    return (
                      <p
                        key={
                          block.id
                        }
                      >
                        <a
                          href={
                            previewUrl
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {
                            block.text
                          }
                        </a>
                      </p>
                    );
                  }

                  return (
                    <p
                      key={
                        block.id
                      }
                    >
                      {
                        block.text
                      }
                    </p>
                  );
                }
              )}
            </div>

            {faq.length >
              0 && (
              <section className="preview-faq">
                <h2>
                  Frequently Asked
                  Questions
                </h2>

                <p>
                  Practical answers
                  to common
                  questions developers
                  have about this
                  topic.
                </p>

                {faq
                  .filter(
                    (item) =>
                      item.question.trim() &&
                      item.answer.trim()
                  )
                  .map(
                    (item) => (
                      <details
                        key={
                          item.id
                        }
                      >
                        <summary>
                          {
                            item.question
                          }
                        </summary>

                        <p>
                          {
                            item.answer
                          }
                        </p>
                      </details>
                    )
                  )}
              </section>
            )}
          </article>
        </main>
      </>
    );
  }

  /* =====================================================
     EDITOR
  ===================================================== */

  return (
    <>
      <PublishStyles />

      <main className="publish-root">
        <header className="publish-header">
          <div>
            <button
              type="button"
              onClick={() =>
                navigate(
                  "/blogs"
                )
              }
              className="editor-back-button"
            >
              <ArrowLeft
                size={15}
              />

              Blogs
            </button>

            <div className="publish-heading">
              <span>
                CONTENT
              </span>

              <h1>
                {isEditMode
                  ? "Edit Blog"
                  : "Publish Blog"}
              </h1>

              <p>
                {isEditMode
                  ? "Update your existing Apives article."
                  : "Create a new Apives article."}
              </p>
            </div>
          </div>

          <div className="header-actions">
            <button
              type="button"
              onClick={() =>
                setPreview(
                  true
                )
              }
              className="preview-button"
            >
              <Eye
                size={15}
              />

              Preview
            </button>

            <button
              type="button"
              onClick={
                handlePublish
              }
              disabled={
                publishing
              }
              className="publish-button"
            >
              {publishing ? (
                isEditMode
                  ? "Saving..."
                  : "Publishing..."
              ) : published ? (
                <>
                  <Check
                    size={15}
                  />

                  {isEditMode
                    ? "Updated"
                    : "Published"}
                </>
              ) : (
                <>
                  <Save
                    size={15}
                  />

                  {isEditMode
                    ? "Save Changes"
                    : "Publish"}
                </>
              )}
            </button>
          </div>
        </header>

        {error && (
          <div className="error-banner">
            <X
              size={15}
            />

            {error}
          </div>
        )}

        {published && (
          <div className="success-banner">
            <Check
              size={15}
            />

            {isEditMode
              ? "Blog updated successfully."
              : "Blog published successfully."}
          </div>
        )}

        <div className="publish-layout">
          <section className="editor-column">

            {/* HERO */}

            <EditorCard
              number="01"
              title="Hero"
              description="Everything shown at the top of the article."
            >
              <div className="field">
                <label>
                  Green eyebrow text
                </label>

                <input
                  value={
                    category
                  }
                  onChange={(e) =>
                    setCategory(
                      e.target.value
                    )
                  }
                  placeholder="API ENGINEERING · DEVELOPER TOOLS"
                />

                <small>
                  This is the small green
                  text above the title.
                </small>
              </div>

              <div className="field">
                <label>
                  Title
                </label>

                <textarea
                  className="title-input"
                  value={title}
                  onChange={(e) =>
                    handleTitleChange(
                      e.target.value
                    )
                  }
                  placeholder="How to Build Better APIs..."
                  rows={3}
                />
              </div>

              <div className="field">
                <label>
                  Short description
                </label>

                <textarea
                  value={
                    excerpt
                  }
                  onChange={(e) =>
                    setExcerpt(
                      e.target.value
                    )
                  }
                  placeholder="A concise description of what this article covers."
                  rows={4}
                />
              </div>

              <div className="two-fields">
                <div className="field">
                  <label>
                    Slug
                  </label>

                  <input
                    value={
                      slug
                    }
                    onChange={(e) =>
                      setSlug(
                        generateSlug(
                          e.target.value
                        )
                      )
                    }
                    placeholder="how-to-build-better-apis"
                  />
                </div>

                <div className="field">
                  <label>
                    Date
                  </label>

                  <input
                    type="date"
                    value={
                      date
                    }
                    onChange={(e) =>
                      setDate(
                        e.target.value
                      )
                    }
                  />

                  <small>
                    {date
                      ? formatDisplayDate(
                          date
                        )
                      : "Select publication date."}
                  </small>
                </div>
              </div>

              <div className="field">
                <label>
                  Author X
                </label>

                <div className="input-prefix">
                  <span>
                    x.com/
                  </span>

                  <input
                    value={authorX.replace(
                      /^@/,
                      ""
                    )}
                    onChange={(e) =>
                      setAuthorX(
                        `@${cleanXHandle(
                          e.target.value
                        )}`
                      )
                    }
                    placeholder="priiincegupta"
                  />
                </div>

                <small>
                  Only the author's X handle
                  is required.
                </small>
              </div>

              <div className="field">
                <label>
                  Keywords
                </label>

                <input
                  value={
                    keywords
                  }
                  onChange={(e) =>
                    setKeywords(
                      e.target.value
                    )
                  }
                  placeholder="APIs, REST API, developers, API security"
                />

                <small>
                  Separate keywords with commas.
                </small>
              </div>
            </EditorCard>

            {/* ARTICLE */}

            <EditorCard
              number="02"
              title="Article"
              description="Build the article exactly like the current BlogPost layout."
            >
              <div className="content-toolbar">
                <button
                  type="button"
                  onClick={() =>
                    addBlock(
                      "paragraph"
                    )
                  }
                >
                  <Plus
                    size={13}
                  />

                  Paragraph
                </button>

                <button
                  type="button"
                  onClick={() =>
                    addBlock(
                      "heading"
                    )
                  }
                >
                  <Heading2
                    size={14}
                  />

                  Heading
                </button>

                <button
                  type="button"
                  onClick={() =>
                    addBlock(
                      "bold"
                    )
                  }
                >
                  <Bold
                    size={14}
                  />

                  Bold
                </button>

                <button
                  type="button"
                  onClick={() =>
                    addBlock(
                      "link"
                    )
                  }
                >
                  <LinkIcon
                    size={14}
                  />

                  Link
                </button>

                <button
                  type="button"
                  onClick={() =>
                    addBlock(
                      "code"
                    )
                  }
                >
                  <Code2
                    size={14}
                  />

                  Code
                </button>
              </div>

              <div className="blocks">
                {content.map(
                  (
                    block,
                    index
                  ) => (
                    <div
                      key={
                        block.id
                      }
                      className="content-block"
                    >
                      <div className="block-top">
                        <div className="block-type">
                          {block.type ===
                            "paragraph" &&
                            "Paragraph"}

                          {block.type ===
                            "heading" &&
                            "Heading"}

                          {block.type ===
                            "bold" &&
                            "Bold"}

                          {block.type ===
                            "link" &&
                            "Link"}

                          {block.type ===
                            "code" &&
                            "Code"}
                        </div>

                        <div className="block-actions">
                          <button
                            type="button"
                            disabled={
                              index ===
                              0
                            }
                            onClick={() =>
                              moveBlock(
                                index,
                                -1
                              )
                            }
                            title="Move up"
                          >
                            <ArrowUp
                              size={13}
                            />
                          </button>

                          <button
                            type="button"
                            disabled={
                              index ===
                              content.length -
                                1
                            }
                            onClick={() =>
                              moveBlock(
                                index,
                                1
                              )
                            }
                            title="Move down"
                          >
                            <ArrowDown
                              size={13}
                            />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              removeBlock(
                                block.id
                              )
                            }
                            className="danger"
                            title="Delete"
                          >
                            <Trash2
                              size={13}
                            />
                          </button>
                        </div>
                      </div>

                      {block.type ===
                      "link" ? (
                        <div className="link-fields">
                          <input
                            value={
                              block.text
                            }
                            onChange={(e) =>
                              updateBlock(
                                block.id,
                                "text",
                                e.target
                                  .value
                              )
                            }
                            placeholder="Link text"
                          />

                          <input
                            value={
                              block.url ||
                              ""
                            }
                            onChange={(e) =>
                              updateBlock(
                                block.id,
                                "url",
                                e.target
                                  .value
                              )
                            }
                            placeholder="https://example.com"
                          />
                        </div>
                      ) : (
                        <textarea
                          className={
                            block.type ===
                            "code"
                              ? "code-editor"
                              : block.type ===
                                "heading"
                              ? "heading-editor"
                              : block.type ===
                                "bold"
                              ? "bold-editor"
                              : ""
                          }
                          value={
                            block.text
                          }
                          onChange={(e) =>
                            updateBlock(
                              block.id,
                              "text",
                              e.target
                                .value
                            )
                          }
                          placeholder={
                            block.type ===
                            "heading"
                              ? "Section heading..."
                              : block.type ===
                                "bold"
                              ? "Important text..."
                              : block.type ===
                                "code"
                              ? '{"example": "response"}'
                              : "Write your paragraph..."
                          }
                          rows={
                            block.type ===
                            "code"
                              ? 7
                              : block.type ===
                                "heading"
                              ? 2
                              : 5
                          }
                        />
                      )}
                    </div>
                  )
                )}
              </div>

              <button
                type="button"
                className="add-paragraph"
                onClick={() =>
                  addBlock(
                    "paragraph"
                  )
                }
              >
                <Plus
                  size={14}
                />

                Add new paragraph
              </button>
            </EditorCard>

            {/* FAQ */}

            <EditorCard
              number="03"
              title="Frequently Asked Questions"
              description="Optional FAQ section shown at the end of the article."
            >
              {faq.length ===
                0 && (
                <div className="empty-editor">
                  No FAQs added yet.
                </div>
              )}

              <div className="faq-editor-list">
                {faq.map(
                  (
                    item,
                    index
                  ) => (
                    <div
                      key={
                        item.id
                      }
                      className="faq-editor-item"
                    >
                      <div className="faq-editor-top">
                        <span>
                          FAQ{" "}
                          {index +
                            1}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            removeFAQ(
                              item.id
                            )
                          }
                        >
                          <Trash2
                            size={13}
                          />
                        </button>
                      </div>

                      <input
                        value={
                          item.question
                        }
                        onChange={(e) =>
                          updateFAQ(
                            item.id,
                            "question",
                            e.target
                              .value
                          )
                        }
                        placeholder="What is an API?"
                      />

                      <textarea
                        value={
                          item.answer
                        }
                        onChange={(e) =>
                          updateFAQ(
                            item.id,
                            "answer",
                            e.target
                              .value
                          )
                        }
                        placeholder="Write the practical answer..."
                        rows={4}
                      />
                    </div>
                  )
                )}
              </div>

              <button
                type="button"
                className="add-faq"
                onClick={
                  addFAQ
                }
              >
                <Plus
                  size={14}
                />

                Add FAQ
              </button>
            </EditorCard>

            {/* SEO */}

            <EditorCard
              number="04"
              title="SEO"
              description="Search metadata for the published article."
            >
              <div className="field">
                <label>
                  SEO title
                </label>

                <input
                  value={
                    seoTitle
                  }
                  onChange={(e) =>
                    setSeoTitle(
                      e.target.value
                    )
                  }
                  placeholder={
                    title ||
                    "SEO title"
                  }
                />
              </div>

              <div className="field">
                <label>
                  SEO description
                </label>

                <textarea
                  value={
                    seoDescription
                  }
                  onChange={(e) =>
                    setSeoDescription(
                      e.target.value
                    )
                  }
                  placeholder={
                    excerpt ||
                    "SEO description"
                  }
                  rows={4}
                />
              </div>
            </EditorCard>
          </section>

          {/* SIDEBAR */}

          <aside className="editor-sidebar">
            <div className="side-card">
              <div className="side-card-label">
                ARTICLE
              </div>

              <div className="side-title">
                {title ||
                  "Untitled blog"}
              </div>

              <div className="side-meta">
                <span>
                  {formatDisplayDate(
                    date
                  ) ||
                    date}
                </span>

                <span>
                  {authorX ||
                    "@author"}
                </span>
              </div>

              <div className="side-divider" />

              <div className="side-stat">
                <span>
                  Content blocks
                </span>

                <strong>
                  {
                    content.filter(
                      (block) =>
                        block.text.trim()
                    ).length
                  }
                </strong>
              </div>

              <div className="side-stat">
                <span>
                  FAQs
                </span>

                <strong>
                  {
                    faq.length
                  }
                </strong>
              </div>

              <div className="side-stat">
                <span>
                  Keywords
                </span>

                <strong>
                  {
                    keywords
                      .split(",")
                      .filter(
                        (item) =>
                          item.trim()
                      ).length
                  }
                </strong>
              </div>
            </div>

            <div className="side-card publish-side">
              <div className="side-card-label">
                PUBLISH
              </div>

              <p>
                Your article will use
                the existing Apives
                BlogPost design after
                publishing.
              </p>

              <button
                type="button"
                onClick={
                  handlePublish
                }
                disabled={
                  publishing
                }
                className="publish-button full"
              >
                {publishing ? (
                  isEditMode
                    ? "Saving..."
                    : "Publishing..."
                ) : (
                  <>
                    <Save
                      size={14}
                    />

                    {isEditMode
                      ? "Save Changes"
                      : "Publish Blog"}
                  </>
                )}
              </button>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}

/* =========================================================
   EDITOR CARD
========================================================= */

function EditorCard({
  number,
  title,
  description,
  children,
}: {
  number: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="editor-card">
      <div className="editor-card-header">
        <div className="editor-number">
          {number}
        </div>

        <div>
          <h2>
            {title}
          </h2>

          <p>
            {description}
          </p>
        </div>
      </div>

      <div className="editor-card-body">
        {children}
      </div>
    </section>
  );
}

/* =========================================================
   STYLES
========================================================= */

function PublishStyles() {
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
        background: rgba(34,197,94,.22);
        color: #fff;
      }

      /* =====================================================
         PREVIEW MODE

         Hide ONLY the main Apives navbar while the
         PublishBlog preview is active.

         The preview's own .preview-topbar is a DIV,
         so it remains visible.
      ===================================================== */

      body.publish-preview-active nav {
        display: none !important;
      }

      .publish-preview-active .preview-topbar {
        display: flex !important;
      }

      .access-loading {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #000;
        color: #fff;
        font-family:
          Inter,
          ui-sans-serif,
          system-ui,
          sans-serif;
      }

      .access-loading-box {
        display: flex;
        align-items: center;
        gap: 10px;
        color: #555;
        font-size: 11px;
      }

      .access-loader {
        width: 14px;
        height: 14px;
        border:
          1px solid
          rgba(255,255,255,.1);
        border-top-color:
          ${GREEN};
        border-radius: 50%;
        animation:
          publish-spin .7s
          linear infinite;
      }

      @keyframes publish-spin {
        to {
          transform: rotate(360deg);
        }
      }

      .publish-root {
        min-height: 100vh;
        background: #000;
        color: #fff;
        padding:
          105px 28px
          100px;
        font-family:
          Inter,
          ui-sans-serif,
          system-ui,
          -apple-system,
          BlinkMacSystemFont,
          "Segoe UI",
          sans-serif;
      }

      .publish-header {
        width: 100%;
        max-width: 1240px;
        margin: 0 auto 32px;
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        gap: 30px;
      }

      .editor-back-button {
        display: inline-flex;
        align-items: center;
        gap: 7px;
        padding: 7px 11px;
        border: 1px solid rgba(255,255,255,.09);
        border-radius: 999px;
        background: rgba(255,255,255,.035);
        color: #777;
        font-size: 10px;
        cursor: pointer;
        transition: .18s ease;
      }

      .editor-back-button:hover {
        color: #fff;
        border-color: rgba(34,197,94,.3);
        background: rgba(255,255,255,.06);
      }

      .publish-heading {
        margin-top: 22px;
      }

      .publish-heading > span {
        color: ${GREEN};
        font-size: 9px;
        font-weight: 800;
        letter-spacing: .18em;
      }

      .publish-heading h1 {
        margin: 6px 0 0;
        font-size: clamp(32px, 4vw, 48px);
        line-height: 1;
        letter-spacing: -2px;
        font-weight: 800;
      }

      .publish-heading p {
        margin: 10px 0 0;
        color: #555;
        font-size: 13px;
      }

      .header-actions {
        display: flex;
        align-items: center;
        gap: 9px;
      }

      .preview-button,
      .publish-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 7px;
        min-height: 38px;
        padding: 0 16px;
        border-radius: 999px;
        border: 1px solid rgba(255,255,255,.1);
        background: rgba(255,255,255,.045);
        color: #aaa;
        font-size: 10px;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: .1em;
        cursor: pointer;
        transition: .2s ease;
      }

      .preview-button:hover {
        color: #fff;
        background: rgba(255,255,255,.08);
      }

      .publish-button {
        border-color: rgba(34,197,94,.35);
        background: ${GREEN};
        color: #000;
        box-shadow:
          0 0 25px
          rgba(34,197,94,.12);
      }

      .publish-button:hover {
        background: #fff;
        transform: translateY(-1px);
      }

      .publish-button:disabled {
        opacity: .55;
        cursor: wait;
        transform: none;
      }

      .publish-button.small {
        min-height: 34px;
      }

      .publish-button.full {
        width: 100%;
        margin-top: 17px;
      }

      .error-banner,
      .success-banner {
        max-width: 1240px;
        margin: 0 auto 18px;
        padding: 11px 14px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 11px;
      }

      .error-banner {
        color: #f87171;
        border: 1px solid rgba(248,113,113,.18);
        background: rgba(248,113,113,.05);
      }

      .success-banner {
        color: ${GREEN};
        border: 1px solid rgba(34,197,94,.18);
        background: rgba(34,197,94,.05);
      }

      .publish-layout {
        max-width: 1240px;
        margin: 0 auto;
        display: grid;
        grid-template-columns:
          minmax(0, 1fr)
          290px;
        gap: 22px;
        align-items: start;
      }

      .editor-column {
        display: flex;
        flex-direction: column;
        gap: 18px;
      }

      .editor-card,
      .side-card {
        border:
          1px solid
          rgba(255,255,255,.08);
        background:
          rgba(255,255,255,.025);
        border-radius: 16px;
        overflow: hidden;
      }

      .editor-card-header {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        padding: 20px 21px;
        border-bottom:
          1px solid
          rgba(255,255,255,.065);
      }

      .editor-number {
        width: 27px;
        height: 27px;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        border:
          1px solid
          rgba(34,197,94,.18);
        background:
          rgba(34,197,94,.06);
        color: ${GREEN};
        font-size: 9px;
        font-weight: 800;
      }

      .editor-card-header h2 {
        margin: 0;
        color: #eee;
        font-size: 15px;
        font-weight: 700;
        letter-spacing: -.2px;
      }

      .editor-card-header p {
        margin: 4px 0 0;
        color: #505050;
        font-size: 11px;
        line-height: 1.5;
      }

      .editor-card-body {
        padding: 21px;
      }

      .field {
        margin-bottom: 18px;
      }

      .field:last-child {
        margin-bottom: 0;
      }

      .field label {
        display: block;
        margin-bottom: 7px;
        color: #aaa;
        font-size: 10px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: .1em;
      }

      .field small {
        display: block;
        margin-top: 6px;
        color: #444;
        font-size: 10px;
        line-height: 1.5;
      }

      .field input,
      .field textarea,
      .link-fields input,
      .faq-editor-item input,
      .faq-editor-item textarea {
        width: 100%;
        border:
          1px solid
          rgba(255,255,255,.09);
        border-radius: 10px;
        outline: none;
        background:
          rgba(255,255,255,.025);
        color: #ddd;
        padding: 11px 12px;
        font: inherit;
        font-size: 12px;
        transition:
          border-color .18s ease,
          background .18s ease;
      }

      .field textarea,
      .faq-editor-item textarea {
        resize: vertical;
        line-height: 1.7;
      }

      .field input:focus,
      .field textarea:focus,
      .link-fields input:focus,
      .faq-editor-item input:focus,
      .faq-editor-item textarea:focus {
        border-color:
          rgba(34,197,94,.35);
        background:
          rgba(255,255,255,.035);
      }

      .title-input {
        font-size: 17px !important;
        line-height: 1.45 !important;
        font-weight: 650;
      }

      .two-fields {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
      }

      .input-prefix {
        display: flex;
        align-items: center;
        overflow: hidden;
        border:
          1px solid
          rgba(255,255,255,.09);
        border-radius: 10px;
        background:
          rgba(255,255,255,.025);
      }

      .input-prefix span {
        padding-left: 12px;
        color: #444;
        font-size: 12px;
      }

      .input-prefix input {
        border: 0;
        background: transparent;
      }

      .content-toolbar {
        display: flex;
        flex-wrap: wrap;
        gap: 7px;
        padding: 9px;
        margin-bottom: 14px;
        border:
          1px solid
          rgba(255,255,255,.07);
        border-radius: 11px;
        background:
          rgba(255,255,255,.018);
      }

      .content-toolbar button,
      .add-paragraph,
      .add-faq {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        min-height: 31px;
        padding: 0 10px;
        border:
          1px solid
          rgba(255,255,255,.08);
        border-radius: 8px;
        background:
          rgba(255,255,255,.035);
        color: #777;
        font-size: 10px;
        font-weight: 650;
        cursor: pointer;
        transition: .18s ease;
      }

      .content-toolbar button:hover,
      .add-paragraph:hover,
      .add-faq:hover {
        color: ${GREEN};
        border-color:
          rgba(34,197,94,.25);
        background:
          rgba(34,197,94,.05);
      }

      .blocks {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .content-block {
        padding: 10px;
        border:
          1px solid
          rgba(255,255,255,.07);
        border-radius: 11px;
        background:
          rgba(0,0,0,.25);
      }

      .block-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 8px;
      }

      .block-type {
        color: ${GREEN};
        font-size: 9px;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: .12em;
      }

      .block-actions {
        display: flex;
        gap: 3px;
      }

      .block-actions button,
      .faq-editor-top button {
        width: 25px;
        height: 25px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 0;
        border-radius: 6px;
        background: transparent;
        color: #4b4b4b;
        cursor: pointer;
      }

      .block-actions button:hover {
        color: #fff;
        background: rgba(255,255,255,.06);
      }

      .block-actions button:disabled {
        opacity: .2;
        cursor: default;
      }

      .block-actions .danger:hover,
      .faq-editor-top button:hover {
        color: #f87171;
        background: rgba(248,113,113,.06);
      }

      .content-block textarea {
        width: 100%;
        min-height: 105px;
        padding: 11px 12px;
        resize: vertical;
        border:
          1px solid
          rgba(255,255,255,.06);
        border-radius: 8px;
        outline: none;
        background: rgba(255,255,255,.02);
        color: #bdbdbd;
        font: inherit;
        font-size: 12px;
        line-height: 1.75;
      }

      .content-block textarea:focus {
        border-color:
          rgba(34,197,94,.25);
      }

      .content-block .heading-editor {
        min-height: 60px;
        font-size: 15px;
        color: #eee;
        font-weight: 650;
      }

      .content-block .bold-editor {
        min-height: 70px;
        color: #eee;
        font-weight: 700;
      }

      .content-block .code-editor {
        min-height: 130px;
        color: #9ca3af;
        font-family:
          ui-monospace,
          SFMono-Regular,
          Menlo,
          Monaco,
          Consolas,
          monospace;
        font-size: 11px;
      }

      .link-fields {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
      }

      .add-paragraph {
        width: 100%;
        margin-top: 11px;
        min-height: 36px;
        border-style: dashed;
      }

      .empty-editor {
        padding: 25px;
        border:
          1px dashed
          rgba(255,255,255,.08);
        border-radius: 10px;
        text-align: center;
        color: #444;
        font-size: 11px;
      }

      .faq-editor-list {
        display: flex;
        flex-direction: column;
        gap: 11px;
      }

      .faq-editor-item {
        padding: 13px;
        border:
          1px solid
          rgba(255,255,255,.07);
        border-radius: 10px;
        background: rgba(0,0,0,.2);
      }

      .faq-editor-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 9px;
      }

      .faq-editor-top span {
        color: ${GREEN};
        font-size: 9px;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: .1em;
      }

      .faq-editor-item input {
        margin-bottom: 8px;
      }

      .add-faq {
        margin-top: 12px;
        width: 100%;
        min-height: 36px;
        border-style: dashed;
      }

      .editor-sidebar {
        position: sticky;
        top: 90px;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .side-card {
        padding: 17px;
      }

      .side-card-label {
        color: ${GREEN};
        font-size: 8px;
        font-weight: 800;
        letter-spacing: .16em;
      }

      .side-title {
        margin-top: 12px;
        color: #ddd;
        font-size: 14px;
        font-weight: 650;
        line-height: 1.45;
      }

      .side-meta {
        display: flex;
        flex-direction: column;
        gap: 5px;
        margin-top: 9px;
        color: #4b4b4b;
        font-size: 10px;
      }

      .side-divider {
        height: 1px;
        margin: 15px 0;
        background: rgba(255,255,255,.07);
      }

      .side-stat {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 7px 0;
        color: #555;
        font-size: 10px;
      }

      .side-stat strong {
        color: #aaa;
        font-size: 11px;
      }

      .publish-side p {
        margin: 10px 0 0;
        color: #555;
        font-size: 10px;
        line-height: 1.65;
      }

      /* ================= PREVIEW ================= */

      .publish-preview-root {
        min-height: 100vh;
        background: #000;
        color: #fff;
        padding-bottom: 100px;
      }

      .preview-topbar {
        position: sticky;
        top: 0;
        z-index: 20;
        height: 62px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 24px;
        border-bottom:
          1px solid
          rgba(255,255,255,.07);
        background:
          rgba(0,0,0,.82);
        backdrop-filter: blur(20px);
      }

      .preview-label {
        color: #555;
        font-size: 9px;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: .18em;
      }

      .preview-article {
        width: 100%;
        max-width: 820px;
        margin: 0 auto;
        padding:
          95px 24px
          100px;
        text-align: center;
      }

      .preview-category {
        margin-bottom: 19px;
        color: ${GREEN};
        font-size: 10px;
        font-weight: 700;
        letter-spacing: .08em;
        text-transform: uppercase;
      }

      .preview-article h1 {
        margin: 0 auto;
        max-width: 820px;
        color: #fff;
        font-size:
          clamp(38px, 6.4vw, 63px);
        line-height: 1.05;
        letter-spacing: -3px;
        font-weight: 800;
      }

      .preview-excerpt {
        max-width: 720px;
        margin: 22px auto 0;
        color: #696969;
        font-size:
          clamp(16px, 2vw, 19px);
        line-height: 1.78;
      }

      .preview-meta {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        margin-top: 19px;
        color: #555;
        font-size: 11px;
      }

      .preview-meta span:first-child {
        color: ${GREEN};
      }

      .preview-meta a {
        color: ${GREEN};
        text-decoration: none;
      }

      .preview-divider {
        width: 100%;
        height: 1px;
        margin-top: 30px;
        background: rgba(255,255,255,.1);
      }

      .preview-content {
        margin-top: 35px;
        text-align: left;
      }

      .preview-content p {
        margin:
          0 0
          27px;
        color: #858585;
        font-size: 17px;
        line-height: 2;
      }

      .preview-content h2 {
        margin:
          50px 0
          20px;
        color: #f5f5f5;
        font-size: 31px;
        line-height: 1.25;
        letter-spacing: -.8px;
      }

      .preview-content strong {
        color: #eee;
        font-weight: 700;
      }

      .preview-content a {
        color: ${GREEN};
        text-decoration: underline;
        text-underline-offset: 4px;
      }

      .preview-content pre {
        overflow-x: auto;
        margin: 25px 0;
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
        text-align: left;
        white-space: pre;
      }

      .preview-content pre code {
        font: inherit;
        color: inherit;
      }

      .preview-faq {
        margin-top: 75px;
        padding-top: 45px;
        border-top:
          1px solid
          rgba(255,255,255,.085);
        text-align: left;
      }

      .preview-faq h2 {
        margin: 0;
        color: #f5f5f5;
        font-size: 31px;
      }

      .preview-faq > p {
        color: #555;
        font-size: 13px;
      }

      .preview-faq details {
        border-top:
          1px solid
          rgba(255,255,255,.07);
      }

      .preview-faq details:last-child {
        border-bottom:
          1px solid
          rgba(255,255,255,.07);
      }

      .preview-faq summary {
        padding: 20px 0;
        color: #c9c9c9;
        font-size: 15px;
        font-weight: 620;
        cursor: pointer;
      }

      .preview-faq details p {
        margin: 0 0 22px;
        color: #666;
        font-size: 14px;
        line-height: 1.8;
      }

      @media (max-width: 800px) {

        .publish-root {
          padding:
            82px 16px
            70px;
        }

        .publish-header {
          align-items: flex-start;
          flex-direction: column;
        }

        .header-actions {
          width: 100%;
        }

        .header-actions button {
          flex: 1;
        }

        .publish-layout {
          grid-template-columns: 1fr;
        }

        .editor-sidebar {
          position: static;
        }
      }

      @media (max-width: 600px) {

        .publish-heading h1 {
          font-size: 34px;
        }

        .editor-card-header,
        .editor-card-body {
          padding: 16px;
        }

        .two-fields,
        .link-fields {
          grid-template-columns: 1fr;
        }

        .content-toolbar {
          display: grid;
          grid-template-columns: 1fr 1fr;
        }

        .preview-topbar {
          padding: 0 14px;
        }

        .preview-article {
          padding:
            65px 20px
            80px;
        }

        .preview-article h1 {
          font-size:
            clamp(33px, 10vw, 45px);
          letter-spacing: -2px;
        }

        .preview-meta {
          flex-wrap: wrap;
        }

        .preview-content p {
          font-size: 15.5px;
          line-height: 1.9;
        }
      }

    `}</style>
  );
}