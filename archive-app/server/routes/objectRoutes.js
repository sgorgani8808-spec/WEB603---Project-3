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
    res.status(500).json({ message: "Could not load objects." });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, category, year, description, images } = req.body;

    if (!title || !category || !year || !description) {
      return res.status(400).json({
        message: "Title, category, year, and description are required."
      });
    }

    const object = await ObjectItem.create({
      title,
      category,
      year,
      description,
      images,
      createdBy: req.session?.userId || null
    });

    res.status(201).json({
      message: "Material added successfully.",
      object
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not add material." });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { title, category, year, description, images } = req.body;

    const object = await ObjectItem.findById(req.params.id);

    if (!object) {
      return res.status(404).json({ message: "Material not found." });
    }

    object.title = title;
    object.category = category;
    object.year = year;
    object.description = description;
    object.images = images;

    await object.save();

    res.json({
      message: "Material updated successfully.",
      object
    });
  } catch (error) {
    res.status(500).json({ message: "Could not update material." });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const object = await ObjectItem.findById(req.params.id);

    if (!object) {
      return res.status(404).json({ message: "Material not found." });
    }

    await object.deleteOne();

    res.json({ message: "Material deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Could not delete material." });
  }
});

module.exports = router;