const express = require("express");
const ObjectItem = require("../models/ObjectItem");
const { isAuthenticated } = require("../middleware/authMiddleware");
const router = express.Router();

/* ========================
   GET ALL OBJECTS
======================== */
router.get("/", async (req, res) => {
  try {
    const objects = await ObjectItem.find().sort({ createdAt: -1 });
    res.json(objects);
  } catch (error) {
    console.error("GET OBJECTS ERROR:", error);
    res.status(500).json({ message: "Could not load objects." });
  }
});

/* ========================
   CREATE OBJECT
======================== */
router.post("/",isAuthenticated, async (req, res) => {
  try {
    const { title, collectionType, category, year, description, images } =
      req.body;

    if (!title || !category || !description) {
      return res.status(400).json({
        message: "Title, category and description are required."
      });
    }

    const object = await ObjectItem.create({
      title,
      collectionType: collectionType || "Material",
      category,
      year,
      description,
      images: images || [],
      createdBy: req.session.userId || null
    });

    res.status(201).json({
      message: "Object added",
      object
    });
  } catch (error) {
    console.error("POST ERROR:", error);
    res.status(500).json({ message: "Could not add object." });
  }
});

/* ========================
   UPDATE OBJECT (EDIT)
======================== */
router.put("/:id", isAuthenticated, async (req, res) => {
  try {
    const { title, collectionType, category, year, description, images } =
      req.body;

    const object = await ObjectItem.findById(req.params.id);

    if (!object) {
      return res.status(404).json({
        message: "Object not found"
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
      message: "Updated successfully",
      object
    });
  } catch (error) {
    console.error("UPDATE ERROR:", error);
    res.status(500).json({
      message: "Could not update object."
    });
  }
});

/* ========================
   DELETE OBJECT
======================== */
router.delete("/:id", isAuthenticated, async (req, res)=> {
  try {
    const object = await ObjectItem.findById(req.params.id);

    if (!object) {
      return res.status(404).json({
        message: "Object not found"
      });
    }

    await object.deleteOne();

    res.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("DELETE ERROR:", error);
    res.status(500).json({
      message: "Could not delete object."
    });
  }
});

/* ========================
   COMMENTS
======================== */
router.post("/:id/comments", async (req, res) => {
  try {
    const { text, author } = req.body;

    if (!text || text.trim().length < 2) {
      return res.status(400).json({
        message: "Comment too short"
      });
    }

    const object = await ObjectItem.findById(req.params.id);

    if (!object) {
      return res.status(404).json({
        message: "Object not found"
      });
    }

    object.comments.push({
      text,
      author: author || "Anonymous"
    });

    await object.save();

    res.json({
      message: "Comment added",
      object
    });
  } catch (error) {
    console.error("COMMENT ERROR:", error);
    res.status(500).json({
      message: "Could not add comment"
    });
  }
});

module.exports = router;