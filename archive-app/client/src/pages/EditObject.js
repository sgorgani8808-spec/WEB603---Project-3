import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";

function EditObject({ objects = [], setObjects }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const categoryOptions = {
    Material: ["Floor Tile", "Wall Tile", "Carpet", "Wood", "Stone", "Metal", "Glass", "Paint", "Textile", "Acoustic Panel"],
    Furniture: ["Chair", "Table", "Sofa", "Storage", "Bench", "Desk", "Stool"],
    Fixture: ["Lighting", "Plumbing", "Hardware", "Display Fixture", "Shelving", "Signage"],
    Article: ["Case Study", "Material Research", "Design Trend", "Interview", "Technical Guide"]
  };

  const [formData, setFormData] = useState({
    title: "",
    collectionType: "Material",
    category: "",
    year: "",
    images: "",
    description: ""
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadObject = async () => {
      try {
        let selected = objects.find((item) => item._id === id);

        if (!selected) {
          const res = await api.get("/objects");
          selected = res.data.find((item) => item._id === id);
        }

        if (!selected) {
          setMessage("Object not found.");
          return;
        }

        const cleanCollectionType =
          selected.collectionType === "Materials"
            ? "Material"
            : selected.collectionType || "Material";

        setFormData({
          title: selected.title || "",
          collectionType: cleanCollectionType,
          category: selected.category || "",
          year: selected.year || selected.date || "",
          images: Array.isArray(selected.images)
            ? selected.images.join("\n")
            : selected.imageUrl || "",
          description: selected.description || ""
        });
      } catch (error) {
        setMessage("Could not load object.");
      }
    };

    loadObject();
  }, [id, objects]);

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

    const updatedObject = {
      title: formData.title,
      collectionType: formData.collectionType,
      category: formData.category,
      year: formData.year,
      description: formData.description,
      images: imageArray
    };

    try {
      const res = await api.put(`/objects/${id}`, updatedObject);

      setObjects((prev) =>
        prev.map((item) => (item._id === id ? res.data.object : item))
      );

      navigate("/");
    } catch (err) {
      setMessage(err.response?.data?.message || "Could not update object.");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this object?")) return;

    try {
      await api.delete(`/objects/${id}`);

      setObjects((prev) => prev.filter((item) => item._id !== id));

      navigate("/");
    } catch (err) {
      setMessage(err.response?.data?.message || "Could not delete object.");
    }
  };

  return (
    <section className="add-object-card">
      <h2>Edit Object</h2>

      {message && <p className="message">{message}</p>}

      <form onSubmit={handleSubmit}>
        <label>Title</label>
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />

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
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="">Select category</option>
          {(categoryOptions[formData.collectionType] || categoryOptions.Material).map(
            (category) => (
              <option key={category} value={category}>
                {category}
              </option>
            )
          )}
        </select>

        <label>Year</label>
        <input
          name="year"
          value={formData.year}
          onChange={handleChange}
        />

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

        <div className="form-actions">
          <button type="submit">Update Object</button>

          <button type="button" className="danger-btn" onClick={handleDelete}>
            Delete Object
          </button>
        </div>
      </form>
    </section>
  );
}

export default EditObject;