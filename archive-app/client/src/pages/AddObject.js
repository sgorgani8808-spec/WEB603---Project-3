import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function AddObject({ objects, setObjects }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    collectionType: "Material",
    category: "",
    year: "",
    images: "",
    description: ""
  });

  const [message, setMessage] = useState("");

  const categoryOptions = {
    Material: ["Floor Tile", "Wall Tile", "Carpet", "Wood", "Stone", "Metal", "Glass", "Paint", "Textile", "Acoustic Panel"],
    Furniture: ["Chair", "Table", "Sofa", "Storage", "Bench", "Desk", "Stool"],
    Fixture: ["Lighting", "Plumbing", "Hardware", "Display Fixture", "Shelving", "Signage"],
    Article: ["Case Study", "Material Research", "Design Trend", "Interview", "Technical Guide"]
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
      ...(name === "collectionType" ? { category: "" } : {})
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const imageArray = formData.images
      .split("\n")
      .map((url) => url.trim())
      .filter((url) => url !== "");

    const newObject = {
      title: formData.title,
      collectionType: formData.collectionType,
      category: formData.category,
      year: formData.year,
      description: formData.description,
      images: imageArray
    };

    try {
      const res = await api.post("/objects", newObject);
      setObjects([res.data.object, ...objects]);
      navigate("/");
    } catch (err) {
      setMessage(err.response?.data?.message || "Could not add object.");
    }
  };

  return (
    <section className="add-object-card">
      <h2>Add Object</h2>

      <form onSubmit={handleSubmit}>
        <label>Title</label>
        <input name="title" value={formData.title} onChange={handleChange} required />

        <label>Collection Type</label>
        <select
          name="collectionType"
          value={formData.collectionType}
          onChange={handleChange}
        >
          <option value="Material">Material</option>
          <option value="Furniture">Furniture</option>
          <option value="Fixture">Fixture</option>
          <option value="Article">Article</option>
        </select>

        <label>Category</label>
        <select name="category" value={formData.category} onChange={handleChange} required>
          <option value="">Select category</option>
          {categoryOptions[formData.collectionType].map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <label>Year</label>
        <input name="year" value={formData.year} onChange={handleChange} />

        <label>Image URLs</label>
        <textarea
          name="images"
          rows="5"
          value={formData.images}
          onChange={handleChange}
          placeholder="Paste one image URL per line"
        />

        <label>Description</label>
        <textarea
          name="description"
          rows="6"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <button type="submit">Add Object</button>
      </form>

      {message && <p className="message">{message}</p>}
    </section>
  );
}

export default AddObject;