import React, { useState } from "react";
import { Link } from "react-router-dom";

function Home({ materials = [] }) {
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [zoomImage, setZoomImage] = useState(null);

  const categories = [
    "All Categories",
    ...new Set(materials.map((item) => item.category))
  ];

  const filteredMaterials =
    selectedCategory === "All Categories"
      ? materials
      : materials.filter((item) => item.category === selectedCategory);

  return (
    <div>
      <main className="container">
        <section className="platform-stats">
          <div>
            <strong>{materials.length}</strong>
            <span>Total Materials</span>
          </div>

          <div>
            <strong>{categories.length - 1}</strong>
            <span>Categories</span>
          </div>

          <div>
            <strong>2026</strong>
            <span>Archive Year</span>
          </div>
        </section>

        <section className="objects-header">
          <div>
            <p className="eyebrow">Browse Collection</p>
            <h2>Materials</h2>
          </div>

          <div className="header-actions">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
          </div>
        </section>

        <section className="object-grid">
          {filteredMaterials.length === 0 ? (
            <div className="empty-message">
              No materials found. Add your first material to the archive.
            </div>
          ) : (
            filteredMaterials.map((material) => {
              const imageList =
                material.images && material.images.length > 0
                  ? material.images
                  : material.imageUrl
                  ? [material.imageUrl]
                  : [];

              return (
                <article className="object-card" key={material.id}>
                  <div className="object-image">
                    {imageList.length > 0 ? (
                      imageList.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`${material.title} ${index + 1}`}
                          onClick={() => setZoomImage(image)}
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://placehold.co/800x500?text=Material+Image";
                          }}
                        />
                      ))
                    ) : (
                      <img
                        src="https://placehold.co/800x500?text=No+Image"
                        alt="No material"
                      />
                    )}
                  </div>

                  <div className="object-meta">
                    <div className="category">{material.category}</div>
                    <h3>{material.title}</h3>
                    <div className="date">{material.year}</div>
                    <p className="desc">{material.description}</p>

                    <Link to={`/edit/${material.id}`} className="edit-link">
                      Edit Material
                    </Link>
                  </div>
                </article>
              );
            })
          )}
        </section>
      </main>

      {zoomImage && (
        <div className="zoom-overlay" onClick={() => setZoomImage(null)}>
          <img src={zoomImage} alt="Zoomed material" className="zoom-image" />
        </div>
      )}
    </div>
  );
}

export default Home;