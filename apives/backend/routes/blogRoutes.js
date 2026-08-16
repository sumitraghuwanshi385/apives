const router = require("express").Router();

const mongoose = require("mongoose");

const Blog = require("../models/Blog");

const verify = require("../middleware/authMiddleware");

const blogAdmin = require("../middleware/blogAdmin");


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
      } = req.body;


      // ================= VALIDATION =================

      if (!title?.trim()) {
        return res.status(400).json({
          message: "Blog title is required",
        });
      }

      if (!excerpt?.trim()) {
        return res.status(400).json({
          message: "Blog excerpt is required",
        });
      }

      if (!content?.trim()) {
        return res.status(400).json({
          message: "Blog content is required",
        });
      }


      // ================= SLUG =================

      const cleanSlug =
        slug?.trim() ||
        title
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-");


      // ================= CHECK SLUG =================

      const existingBlog =
        await Blog.findOne({
          slug: cleanSlug,
        });

      if (existingBlog) {
        return res.status(409).json({
          message:
            "A blog with this slug already exists",
        });
      }


      // ================= AUTHOR =================

      const blogAuthor = {
        name:
          author?.name?.trim() ||
          "Priince Gupta",

        x:
          author?.x?.trim() ||
          "@priiincegupta",
      };


      // ================= KEYWORDS =================

      const cleanKeywords =
        Array.isArray(keywords)
          ? keywords
              .map((keyword) =>
                String(keyword).trim()
              )
              .filter(Boolean)
          : [];


      // ================= FAQ =================

      const cleanFaq =
        Array.isArray(faq)
          ? faq
              .filter(
                (item) =>
                  item?.question?.trim() &&
                  item?.answer?.trim()
              )
              .map((item) => ({
                question:
                  item.question.trim(),

                answer:
                  item.answer.trim(),
              }))
          : [];


      // ================= CREATE =================

      const blog =
        new Blog({
          slug: cleanSlug,

          category:
            category?.trim() ||
            "Developer Insights",

          title:
            title.trim(),

          excerpt:
            excerpt.trim(),

          date:
            date?.trim() ||
            new Date().toLocaleDateString(
              "en-US",
              {
                month: "short",
                day: "numeric",
                year: "numeric",
              }
            ),

          author: blogAuthor,

          content:
            content.trim(),

          keywords:
            cleanKeywords,

          faq:
            cleanFaq,

          published:
            published !== false,
        });


      const savedBlog =
        await blog.save();


      return res.status(201).json({
        success: true,

        message:
          "Blog published successfully",

        blog: savedBlog,
      });

    } catch (err) {

      console.error(
        "❌ CREATE BLOG Error:",
        err
      );


      // Duplicate slug safety

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
        blogs,
        total: blogs.length,
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
// GET SINGLE BLOG BY SLUG
// PUBLIC
// =====================================================

router.get(
  "/slug/:slug",
  async (req, res) => {
    try {

      const {
        slug,
      } = req.params;


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
        "❌ GET BLOG Error:",
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
// GET MY / ADMIN BLOGS
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
        blogs,
        total: blogs.length,
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
        );


      if (!blog) {
        return res.status(404).json({
          message:
            "Blog not found",
        });
      }


      return res.json(blog);

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
// UPDATE BLOG
// ADMIN ONLY
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
        );


      if (!blog) {
        return res.status(404).json({
          message:
            "Blog not found",
        });
      }


      const allowedFields = [
        "slug",
        "category",
        "title",
        "excerpt",
        "date",
        "author",
        "content",
        "keywords",
        "faq",
        "published",
      ];


      allowedFields.forEach(
        (field) => {
          if (
            req.body[field] !==
            undefined
          ) {
            blog[field] =
              req.body[field];
          }
        }
      );


      await blog.save();


      return res.json({
        success: true,

        message:
          "Blog updated successfully",

        blog,
      });

    } catch (err) {

      console.error(
        "❌ UPDATE BLOG Error:",
        err
      );

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
        );


      if (!blog) {
        return res.status(404).json({
          message:
            "Blog not found",
        });
      }


      await Blog.findByIdAndDelete(
        id
      );


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


module.exports = router;