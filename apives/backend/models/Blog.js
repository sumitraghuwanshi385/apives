const mongoose = require("mongoose");

const FAQSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },

    answer: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    _id: false,
  }
);

const BlogSchema = new mongoose.Schema(
  {
    // =====================================================
    // BASIC
    // =====================================================

    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
      default: "Developer Insights",
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    excerpt: {
      type: String,
      required: true,
      trim: true,
    },

    date: {
      type: String,
      required: true,
      trim: true,
    },

    // =====================================================
    // AUTHOR
    // =====================================================

    author: {
      name: {
        type: String,
        default: "Priince Gupta",
        trim: true,
      },

      x: {
        type: String,
        default: "@priiincegupta",
        trim: true,
      },
    },

    // =====================================================
    // CONTENT
    // =====================================================

    content: {
      type: String,
      required: true,
    },

    // =====================================================
    // SEO
    // =====================================================

    seo: {
      title: {
        type: String,
        default: "",
        trim: true,
      },

      description: {
        type: String,
        default: "",
        trim: true,
      },
    },

    // =====================================================
    // KEYWORDS
    // =====================================================

    keywords: {
      type: [String],
      default: [],
    },

    // =====================================================
    // FAQ
    // =====================================================

    faq: {
      type: [FAQSchema],
      default: [],
    },

    // =====================================================
    // PUBLISH STATUS
    // =====================================================

    published: {
      type: Boolean,
      default: true,
      index: true,
    },
  },

  {
    timestamps: true,
  }
);

// =========================================================
// MODEL
// =========================================================

module.exports =
  mongoose.models.Blog ||
  mongoose.model("Blog", BlogSchema);