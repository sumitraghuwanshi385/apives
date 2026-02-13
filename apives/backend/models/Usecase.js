import mongoose from "mongoose";

const usecaseSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true
    },

    title: String,
    description: String,

    operationalInsight: {
      type: String,
      default: ""
    },

    curatedApiIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ApiListing"
      }
    ],

    published: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Usecase", usecaseSchema);