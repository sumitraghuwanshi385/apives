const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
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
    },

    author: {
      name: {
        type: String,
        default: "Priince Gupta",
      },

      x: {
        type: String,
        default: "@priiincegupta",
      },
    },

    content: {
      type: String,
      required: true,
    },

    keywords: {
      type: [String],
      default: [],
    },

    faq: [
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
    ],

    published: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.Blog ||
  mongoose.model("Blog", BlogSchema);