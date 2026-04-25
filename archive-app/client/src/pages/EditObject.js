import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";

function EditObject() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    date: "",
    imageUrl: "",
    description: ""
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get("/objects").then((response) => {
      const selected = response.data.find((item) => item._id === id);

      if (selected) {
        setFormData({
          title: selected.title,
          category: selected.category,
          date: selected.date,
          imageUrl: selected.imageUrl || "",
          description: selected.description
        });
      }
    });
  }, [id]);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await api.put(`/objects/${id}`, formData);
      navigate("/");
    } catch (error) {
      setMessage(error.response?.data?.message || "Update failed.");
    }
  };

  return (
    <section className="add-object-card">
      <h2>Edit Material</h2>

      <form onSubmit={handleSubmit}>
        <label>Title</label>
        <input name="title" value={formData.title} onChange={handleChange} />

        <label>Category</label>
        <select name="category" value={formData.category} onChange={handleChange}>
          <option value="">Select category</option>
          <option value="Floor Tile">Floor Tile</option>
          <option value="Wall Tile">Wall Tile</option>
          <option value="Carpet">Carpet</option>
          <option value="Wood">Wood</option>
          <option value="Stone">Stone</option>
          <option value="Metal">Metal</option>
          <option value="Glass">Glass</option>
          <option value="Paint">Paint</option>
          <option value="Textile">Textile</option>
          <option value="Acoustic Panel">Acoustic Panel</option>
          <option value="Sustainable Material">Sustainable Material</option>
        </select>

        <label>Date</label>
        <input name="date" value={formData.date} onChange={handleChange} />

        <label>Image URL</label>
        <input name="imageUrl" value={formData.imageUrl} onChange={handleChange} />

        <label>Description</label>
        <textarea
          name="description"
          rows="6"
          value={formData.description}
          onChange={handleChange}
        />

        <button type="submit">Update Material</button>
      </form>

      {message && <p className="message">{message}</p>}
    </section>
  );
}

export default EditObject;