const router = require("express").Router();

const mongoose = require("mongoose");

const Blog = require("../models/Blog");

const verify = require("../middleware/authMiddleware");

const blogAdmin = require("../middleware/blogAdmin");


// =====================================================
// HELPERS
// =====================================================

const cleanString = (value) => {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
};


const createSlug = (value) => {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
};


const cleanKeywords = (keywords) => {
  if (!Array.isArray(keywords)) {
    return [];
  }

  return keywords
    .map((keyword) =>
      String(keyword || "").trim()
    )
    .filter(Boolean);
};


const cleanFaq = (faq) => {
  if (!Array.isArray(faq)) {
    return [];
  }

  return faq
    .filter(
      (item) =>
        item &&
        typeof item.question === "string" &&
        typeof item.answer === "string" &&
        item.question.trim() &&
        item.answer.trim()
    )
    .map((item) => ({
      question: item.question.trim(),
      answer: item.answer.trim(),
    }));
};


const cleanAuthor = (author) => {
  return {
    name:
      cleanString(author?.name) ||
      "Priince Gupta",

    x:
      cleanString(author?.x) ||
      "@priiincegupta",
  };
};


const cleanSEO = (seo) => {
  return {
    title:
      cleanString(seo?.title),

    description:
      cleanString(seo?.description),
  };
};


// =====================================================
// CREATE / PUBLISH BLOG
// ADMIN ONLY
// =====================================================

router.post(
  "/",
  verify,
  blogAdmin,
  async (req, res) => {
    try {
      const {
        slug,
        category,
        title,
        excerpt,
        date,
        author,
        content,
        keywords,
        faq,
        published,
        seo,
      } = req.body;


      // =================================================
      // VALIDATION
      // =================================================

      const cleanTitle =
        cleanString(title);

      const cleanExcerpt =
        cleanString(excerpt);

      const cleanContent =
        cleanString(content);


      if (!cleanTitle) {
        return res.status(400).json({
          message:
            "Blog title is required",
        });
      }


      if (!cleanExcerpt) {
        return res.status(400).json({
          message:
            "Blog excerpt is required",
        });
      }


      if (!cleanContent) {
        return res.status(400).json({
          message:
            "Blog content is required",
        });
      }


      // =================================================
      // SLUG
      // =================================================

      const cleanSlug =
        createSlug(slug) ||
        createSlug(cleanTitle);


      if (!cleanSlug) {
        return res.status(400).json({
          message:
            "A valid blog slug could not be generated",
        });
      }


      // =================================================
      // CHECK DUPLICATE SLUG
      // =================================================

      const existingBlog =
        await Blog.findOne({
          slug: cleanSlug,
        }).lean();


      if (existingBlog) {
        return res.status(409).json({
          message:
            "A blog with this slug already exists",
        });
      }


      // =================================================
      // AUTHOR
      // =================================================

      const blogAuthor =
        cleanAuthor(author);


      // =================================================
      // KEYWORDS
      // =================================================

      const finalKeywords =
        cleanKeywords(keywords);


      // =================================================
      // FAQ
      // =================================================

      const finalFaq =
        cleanFaq(faq);


      // =================================================
      // SEO
      // =================================================

      const finalSEO =
        cleanSEO(seo);


      // =================================================
      // DATE
      // =================================================

      const finalDate =
        cleanString(date) ||
        new Date().toLocaleDateString(
          "en-US",
          {
            month: "short",
            day: "numeric",
            year: "numeric",
          }
        );


      // =================================================
      // CREATE BLOG
      // =================================================

      const blog =
        new Blog({
          slug:
            cleanSlug,

          category:
            cleanString(category) ||
            "Developer Insights",

          title:
            cleanTitle,

          excerpt:
            cleanExcerpt,

          date:
            finalDate,

          author:
            blogAuthor,

          content:
            cleanContent,

          seo:
            finalSEO,

          keywords:
            finalKeywords,

          faq:
            finalFaq,

          published:
            published !== false,
        });


      const savedBlog =
        await blog.save();


      // =================================================
      // RESPONSE
      // =================================================

      return res.status(201).json({
        success: true,

        message:
          "Blog published successfully",

        blog:
          savedBlog,
      });

    } catch (err) {

      console.error(
        "❌ CREATE BLOG Error:",
        err
      );


      // =================================================
      // DUPLICATE SLUG SAFETY
      // =================================================

      if (err.code === 11000) {
        return res.status(409).json({
          message:
            "A blog with this slug already exists",
        });
      }


      return res.status(500).json({
        message:
          err.message ||
          "Failed to publish blog",
      });
    }
  }
);


// =====================================================
// GET ALL PUBLISHED BLOGS
// PUBLIC
// =====================================================

router.get(
  "/",
  async (req, res) => {
    try {

      const blogs =
        await Blog.find({
          published: true,
        })
          .sort({
            createdAt: -1,
          })
          .lean();


      return res.json({
        success: true,

        blogs,

        total:
          blogs.length,
      });

    } catch (err) {

      console.error(
        "❌ GET BLOGS Error:",
        err
      );


      return res.status(500).json({
        message:
          "Failed to fetch blogs",
      });
    }
  }
);


// =====================================================
// GET SINGLE PUBLISHED BLOG BY SLUG
// PUBLIC
// =====================================================

router.get(
  "/slug/:slug",
  async (req, res) => {
    try {

      const slug =
        createSlug(
          req.params.slug
        );


      if (!slug) {
        return res.status(400).json({
          message:
            "Invalid blog slug",
        });
      }


      const blog =
        await Blog.findOne({
          slug,
          published: true,
        }).lean();


      if (!blog) {
        return res.status(404).json({
          message:
            "Blog not found",
        });
      }


      return res.json(blog);

    } catch (err) {

      console.error(
        "❌ GET BLOG BY SLUG Error:",
        err
      );


      return res.status(500).json({
        message:
          "Failed to fetch blog",
      });
    }
  }
);


// =====================================================
// GET ALL BLOGS
// ADMIN ONLY
// =====================================================

router.get(
  "/admin/all",
  verify,
  blogAdmin,
  async (req, res) => {
    try {

      const blogs =
        await Blog.find({})
          .sort({
            createdAt: -1,
          })
          .lean();


      return res.json({
        success: true,

        blogs,

        total:
          blogs.length,
      });

    } catch (err) {

      console.error(
        "❌ GET ADMIN BLOGS Error:",
        err
      );


      return res.status(500).json({
        message:
          "Failed to fetch admin blogs",
      });
    }
  }
);


// =====================================================
// GET SINGLE BLOG FOR ADMIN
// ADMIN ONLY
//
// Existing admin endpoint:
//
// GET /api/blogs/admin/:id
//
// Kept intact so any existing frontend using it
// continues to work.
// =====================================================

router.get(
  "/admin/:id",
  verify,
  blogAdmin,
  async (req, res) => {
    try {

      const {
        id,
      } = req.params;


      if (
        !mongoose.Types.ObjectId.isValid(
          id
        )
      ) {
        return res.status(400).json({
          message:
            "Invalid blog id",
        });
      }


      const blog =
        await Blog.findById(
          id
        ).lean();


      if (!blog) {
        return res.status(404).json({
          message:
            "Blog not found",
        });
      }


      return res.json({
        success: true,

        blog,
      });

    } catch (err) {

      console.error(
        "❌ GET ADMIN BLOG Error:",
        err
      );


      return res.status(500).json({
        message:
          "Failed to fetch blog",
      });
    }
  }
);


// =====================================================
// GET SINGLE BLOG BY ID
// ADMIN ONLY
//
// IMPORTANT:
//
// PublishBlog.tsx currently requests:
//
// GET /api/blogs/:id
//
// This route is the missing piece required for
// /admin/blogs/edit/:id.
//
// It is intentionally placed AFTER:
//   /
//   /slug/:slug
//   /admin/all
//   /admin/:id
//
// so those routes continue to work correctly.
// =====================================================

router.get(
  "/:id",
  verify,
  blogAdmin,
  async (req, res) => {
    try {

      const {
        id,
      } = req.params;


      // =================================================
      // VALIDATE MONGODB OBJECT ID
      // =================================================

      if (
        !mongoose.Types.ObjectId.isValid(
          id
        )
      ) {
        return res.status(400).json({
          message:
            "Invalid blog id",
        });
      }


      // =================================================
      // FIND BLOG
      // =================================================

      const blog =
        await Blog.findById(
          id
        ).lean();


      if (!blog) {
        return res.status(404).json({
          message:
            "Blog not found",
        });
      }


      // =================================================
      // RESPONSE
      // =================================================

      return res.json({
        success: true,

        blog,
      });

    } catch (err) {

      console.error(
        "❌ GET BLOG BY ID Error:",
        err
      );


      return res.status(500).json({
        message:
          "Failed to fetch blog",
      });
    }
  }
);


// =====================================================
// UPDATE BLOG
// ADMIN ONLY
//
// PUT /api/blogs/:id
// =====================================================

router.put(
  "/:id",
  verify,
  blogAdmin,
  async (req, res) => {
    try {

      const {
        id,
      } = req.params;


      // =================================================
      // VALIDATE ID
      // =================================================

      if (
        !mongoose.Types.ObjectId.isValid(
          id
        )
      ) {
        return res.status(400).json({
          message:
            "Invalid blog id",
        });
      }


      // =================================================
      // FIND BLOG
      // =================================================

      const blog =
        await Blog.findById(
          id
        );


      if (!blog) {
        return res.status(404).json({
          message:
            "Blog not found",
        });
      }


      // =================================================
      // SLUG
      // =================================================

      if (
        req.body.slug !==
        undefined
      ) {

        const newSlug =
          createSlug(
            req.body.slug
          );


        if (!newSlug) {
          return res.status(400).json({
            message:
              "Invalid blog slug",
          });
        }


        // Check whether another blog
        // already uses this slug.

        const duplicateSlug =
          await Blog.findOne({
            slug: newSlug,

            _id: {
              $ne: id,
            },
          }).lean();


        if (duplicateSlug) {
          return res.status(409).json({
            message:
              "A blog with this slug already exists",
          });
        }


        blog.slug =
          newSlug;
      }


      // =================================================
      // BASIC FIELDS
      // =====================================================

      if (
        req.body.category !==
        undefined
      ) {
        blog.category =
          cleanString(
            req.body.category
          ) ||
          "Developer Insights";
      }


      if (
        req.body.title !==
        undefined
      ) {
        const newTitle =
          cleanString(
            req.body.title
          );


        if (!newTitle) {
          return res.status(400).json({
            message:
              "Blog title cannot be empty",
          });
        }


        blog.title =
          newTitle;
      }


      if (
        req.body.excerpt !==
        undefined
      ) {
        const newExcerpt =
          cleanString(
            req.body.excerpt
          );


        if (!newExcerpt) {
          return res.status(400).json({
            message:
              "Blog excerpt cannot be empty",
          });
        }


        blog.excerpt =
          newExcerpt;
      }


      // =================================================
      // DATE
      // =================================================

      if (
        req.body.date !==
        undefined
      ) {
        const newDate =
          cleanString(
            req.body.date
          );


        if (!newDate) {
          return res.status(400).json({
            message:
              "Blog date cannot be empty",
          });
        }


        blog.date =
          newDate;
      }


      // =================================================
      // CONTENT
      // =================================================

      if (
        req.body.content !==
        undefined
      ) {
        const newContent =
          cleanString(
            req.body.content
          );


        if (!newContent) {
          return res.status(400).json({
            message:
              "Blog content cannot be empty",
          });
        }


        blog.content =
          newContent;
      }


      // =================================================
      // AUTHOR
      // =================================================

      if (
        req.body.author !==
        undefined
      ) {
        blog.author =
          cleanAuthor(
            req.body.author
          );
      }


      // =================================================
      // SEO
      // =================================================

      if (
        req.body.seo !==
        undefined
      ) {
        blog.seo =
          cleanSEO(
            req.body.seo
          );
      }


      // =================================================
      // KEYWORDS
      // =================================================

      if (
        req.body.keywords !==
        undefined
      ) {
        blog.keywords =
          cleanKeywords(
            req.body.keywords
          );
      }


      // =================================================
      // FAQ
      // =================================================

      if (
        req.body.faq !==
        undefined
      ) {
        blog.faq =
          cleanFaq(
            req.body.faq
          );
      }


      // =================================================
      // PUBLISHED
      // =================================================

      if (
        req.body.published !==
        undefined
      ) {
        blog.published =
          Boolean(
            req.body.published
          );
      }


      // =================================================
      // SAVE
      // =================================================

      const updatedBlog =
        await blog.save();


      // =================================================
      // RESPONSE
      // =================================================

      return res.json({
        success: true,

        message:
          "Blog updated successfully",

        blog:
          updatedBlog,
      });

    } catch (err) {

      console.error(
        "❌ UPDATE BLOG Error:",
        err
      );


      // =================================================
      // DUPLICATE SLUG SAFETY
      // =================================================

      if (err.code === 11000) {
        return res.status(409).json({
          message:
            "A blog with this slug already exists",
        });
      }


      return res.status(500).json({
        message:
          err.message ||
          "Failed to update blog",
      });
    }
  }
);


// =====================================================
// DELETE BLOG
// ADMIN ONLY
//
// Existing delete functionality preserved.
// =====================================================

router.delete(
  "/:id",
  verify,
  blogAdmin,
  async (req, res) => {
    try {

      const {
        id,
      } = req.params;


      // =================================================
      // VALIDATE ID
      // =================================================

      if (
        !mongoose.Types.ObjectId.isValid(
          id
        )
      ) {
        return res.status(400).json({
          message:
            "Invalid blog id",
        });
      }


      // =================================================
      // FIND BLOG
      // =================================================

      const blog =
        await Blog.findById(
          id
        );


      if (!blog) {
        return res.status(404).json({
          message:
            "Blog not found",
        });
      }


      // =================================================
      // DELETE
      // =================================================

      await Blog.findByIdAndDelete(
        id
      );


      // =================================================
      // RESPONSE
      // =================================================

      return res.json({
        success: true,

        message:
          "Blog deleted successfully",
      });

    } catch (err) {

      console.error(
        "❌ DELETE BLOG Error:",
        err
      );


      return res.status(500).json({
        message:
          "Failed to delete blog",
      });
    }
  }
);


// =====================================================
// EXPORT
// =====================================================

module.exports = router;