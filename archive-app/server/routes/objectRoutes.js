const express = require("express");
const ObjectItem = require("../models/ObjectItem");
const { isAuthenticated } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const objects = await ObjectItem.find()
      .populate("createdBy", "username email")
      .sort({ createdAt: -1 });

    res.json(objects);
  } catch (error) {
    console.error("GET OBJECTS ERROR:", error);
    res.status(500).json({ message: "Could not load objects." });
  }
});

router.post("/", isAuthenticated, async (req, res) => {
  try {
    const { title, collectionType, category, year, description, images } =
      req.body;

    if (!title || title.trim().length < 3) {
      return res.status(400).json({
        message: "Title must be at least 3 characters."
      });
    }

    if (!category) {
      return res.status(400).json({
        message: "Category is required."
      });
    }

    if (!description || description.trim().length < 20) {
      return res.status(400).json({
        message: "Description must be at least 20 characters."
      });
    }

    const object = await ObjectItem.create({
      title,
      collectionType: collectionType || "Material",
      category,
      year,
      description,
      images: images || [],
      createdBy: req.session.userId
    });

    res.status(201).json({
      message: "Object added successfully.",
      object
    });
  } catch (error) {
    console.error("POST OBJECT ERROR:", error);
    res.status(500).json({ message: "Could not add object." });
  }
});

router.put("/:id", isAuthenticated, async (req, res) => {
  try {
    const { title, collectionType, category, year, description, images } =
      req.body;

    const object = await ObjectItem.findById(req.params.id);

    if (!object) {
      return res.status(404).json({ message: "Object not found." });
    }

    if (
      object.createdBy &&
      object.createdBy.toString() !== req.session.userId &&
      req.session.role !== "admin"
    ) {
      return res.status(403).json({
        message: "You can only edit objects you created."
      });
    }

    if (!title || title.trim().length < 3) {
      return res.status(400).json({
        message: "Title must be at least 3 characters."
      });
    }

    if (!description || description.trim().length < 20) {
      return res.status(400).json({
        message: "Description must be at least 20 characters."
      });
    }

    object.title = title;
    object.collectionType = collectionType || object.collectionType;
    object.category = category;
    object.year = year;
    object.description = description;
    object.images = images || [];

    await object.save();

    res.json({
      message: "Object updated successfully.",
      object
    });
  } catch (error) {
    console.error("PUT OBJECT ERROR:", error);
    res.status(500).json({ message: "Could not update object." });
  }
});

router.delete("/:id", isAuthenticated, async (req, res) => {
  try {
    const object = await ObjectItem.findById(req.params.id);

    if (!object) {
      return res.status(404).json({ message: "Object not found." });
    }

    if (
      object.createdBy &&
      object.createdBy.toString() !== req.session.userId &&
      req.session.role !== "admin"
    ) {
      return res.status(403).json({
        message: "You can only delete objects you created."
      });
    }

    await object.deleteOne();

    res.json({ message: "Object deleted successfully." });
  } catch (error) {
    console.error("DELETE OBJECT ERROR:", error);
    res.status(500).json({ message: "Could not delete object." });
  }
});

router.post("/:id/comments", isAuthenticated, async (req, res) => {
  try {
    const { text, author } = req.body;

    if (!text || text.trim().length < 2) {
      return res.status(400).json({
        message: "Comment must be at least 2 characters."
      });
    }

    const object = await ObjectItem.findById(req.params.id);

    if (!object) {
      return res.status(404).json({ message: "Object not found." });
    }

    object.comments.push({
      text,
      author: author || "Anonymous"
    });

    await object.save();

    res.status(201).json({
      message: "Comment added.",
      object
    });
  } catch (error) {
    console.error("COMMENT ERROR:", error);
    res.status(500).json({ message: "Could not add comment." });
  }
});

module.exports = router;