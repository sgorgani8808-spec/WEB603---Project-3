const mongoose = require("mongoose");

const objectItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    collectionType: {
      type: String,
      enum: ["Material", "Furniture", "Fixture", "Article"],
      default: "Material"
    },

    category: {
      type: String,
      required: true,
      trim: true
    },

    year: {
      type: String,
      trim: true
    },

    description: {
      type: String,
      required: true,
      trim: true
    },

    images: {
      type: [String],
      default: []
    },

    comments: [
      {
        text: {
          type: String,
          required: true
        },
        author: {
          type: String,
          default: "Anonymous"
        },
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("ObjectItem", objectItemSchema);