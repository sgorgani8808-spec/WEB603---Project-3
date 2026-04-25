const mongoose = require("mongoose");

const objectItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    category: {
      type: String,
      required: true,
      trim: true
    },

    date: {
      type: String,
      required: true
    },

    description: {
      type: String,
      required: true,
      minlength: 20
    },

    imageUrl: {
      type: String,
      default: ""
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("ObjectItem", objectItemSchema);