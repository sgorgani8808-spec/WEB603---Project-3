import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddObject({ materials, setMaterials }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    category: "Floor Tile",
    year: "",
    images: "",
    description: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 🔥 Convert images string → array
    const imageArray = formData.images
      .split("\n")
      .map((img) => img.trim())
      .filter((img) => img !== "");

    const newMaterial = {
      id: Date.now(),
      title: formData.title,
      category: formData.category,
      year: formData.year,
      images: imageArray,
      description: formData.description
    };

    // 🔥 Update state
    setMaterials([...materials, newMaterial]);

    // 🔥 Go back to home
    navigate("/");
  };

  return (
    <div className="form-page">
      <h1>Add Material</h1>

      <form onSubmit={handleSubmit} className="material-form">
        <label>TITLE</label>
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <label>CATEGORY</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
        >
          <option>Floor Tile</option>
          <option>Wall Tile</option>
          <option>Stone</option>
          <option>Wood</option>
          <option>Concrete</option>
          <option>Carpet</option>
        </select>

        <label>YEAR</label>
        <input
          name="year"
          value={formData.year}
          onChange={handleChange}
        />

        <label>IMAGE URLS (one per line)</label>
        <textarea
          name="images"
          value={formData.images}
          onChange={handleChange}
          placeholder="https://image1.jpg\nhttps://image2.jpg"
          rows="4"
        />

        <label>DESCRIPTION</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="4"
        />

        <button type="submit" className="primary-btn">
          ADD MATERIAL
        </button>
      </form>
    </div>
  );
}

export default AddObject;