import React, { useState } from "react";
import { Link } from "react-router-dom";

function ImageSlider({ images = [], title, onZoom }) {
  const [index, setIndex] = useState(0);

  if (!images.length) {
    return (
      <img src="https://placehold.co/800x500?text=No+Image" alt="No object" />
    );
  }

  return (
    <div className="image-slider">
      <img
        src={images[index]}
        alt={title}
        onClick={() => onZoom(images[index])}
      />

      {images.length > 1 && (
        <>
          <button
            className="slider-btn prev"
            onClick={() =>
              setIndex(index === 0 ? images.length - 1 : index - 1)
            }
          >
            ‹
          </button>

          <button
            className="slider-btn next"
            onClick={() =>
              setIndex(index === images.length - 1 ? 0 : index + 1)
            }
          >
            ›
          </button>
        </>
      )}
    </div>
  );
}

function Home({ objects = [], setObjects, searchTerm = "", user }) {
  const [selectedCollection, setSelectedCollection] = useState("All");
  const [zoomImage, setZoomImage] = useState(null);
  const [commentInputs, setCommentInputs] = useState({});

  const collections = ["All", "Material", "Furniture", "Fixture", "Article"];

  const filteredObjects = objects.filter((item) => {
    const search = searchTerm.toLowerCase();

    const collection = item.collectionType || "Material";

    return (
      (selectedCollection === "All" || collection === selectedCollection) &&
      (item.title?.toLowerCase().includes(search) ||
        item.category?.toLowerCase().includes(search) ||
        item.description?.toLowerCase().includes(search))
    );
  });

  const handleShare = (id) => {
    const url = `${window.location.origin}/edit/${id}`;
    navigator.clipboard.writeText(url);
    alert("Link copied!");
  };

  return (
    <main className="container">
      {/* FEATURED */}
      <section className="featured-collection">
        <div className="featured-line"></div>

        <h1>Featured Collection</h1>

        <p>
          A curated selection of archival objects highlighting design, culture,
          and history.
        </p>

        <button onClick={() => setSelectedCollection("All")}>
          Explore Collection
        </button>
      </section>

      {/* STATS */}
      <section className="platform-stats">
        <div>
          <strong>{objects.length}</strong>
          <span>Total Objects</span>
        </div>

        <div>
          <strong>{collections.length - 1}</strong>
          <span>Collections</span>
        </div>

        <div>
          <strong>2026</strong>
          <span>Archive Year</span>
        </div>
      </section>

      {/* HEADER */}
      <section className="objects-header">
        <div>
          <p className="eyebrow">Browse Collection</p>
          <h2>Archive Objects</h2>
        </div>

        <select
          value={selectedCollection}
          onChange={(e) => setSelectedCollection(e.target.value)}
        >
          {collections.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </section>

      {/* TABS */}
      <section className="collection-tabs">
        {collections.map((c) => (
          <button
            key={c}
            className={selectedCollection === c ? "active" : ""}
            onClick={() => setSelectedCollection(c)}
          >
            {c === "All" ? "All" : `${c}s`}
          </button>
        ))}
      </section>

      {/* GRID */}
      <section className="object-grid">
        {filteredObjects.length === 0 ? (
          <div className="empty-message">
            No objects found. Add your first object to the archive.
          </div>
        ) : (
          filteredObjects.map((item) => {
            const images =
              item.images?.length > 0
                ? item.images
                : item.imageUrl
                ? [item.imageUrl]
                : [];

            const collection = item.collectionType || "Material";

            return (
              <article key={item._id} className="object-card">
                <div className="object-image">
                  <ImageSlider
                    images={images}
                    title={item.title}
                    onZoom={setZoomImage}
                  />
                </div>

                <div className="object-meta">
                  <div className="category">
                    {collection} / {item.category}
                  </div>

                  <h3>{item.title}</h3>

                  <div className="date">{item.year || item.date}</div>

                  <p className="desc">{item.description}</p>

                  <div className="card-actions">
                    <Link
                      to={`/edit/${item._id}`}
                      className="action-link"
                    >
                      Edit
                    </Link>

                    <button
                      className="action-link"
                      onClick={() => handleShare(item._id)}
                    >
                      Share
                    </button>
                  </div>

                  {/* COMMENTS */}
                  <div className="comment-section">
                    <h4>Comments</h4>

                    {item.comments?.length ? (
                      item.comments.map((c, i) => (
                        <p key={i} className="comment">
                          <strong>{c.author || "Anonymous"}:</strong> {c.text}
                        </p>
                      ))
                    ) : (
                      <p className="comment empty">No comments yet.</p>
                    )}

                    <input
                      placeholder="Add a comment..."
                      value={commentInputs[item._id] || ""}
                      onChange={(e) =>
                        setCommentInputs({
                          ...commentInputs,
                          [item._id]: e.target.value
                        })
                      }
                    />
                  </div>
                </div>
              </article>
            );
          })
        )}
      </section>

      {/* ZOOM */}
      {zoomImage && (
        <div className="zoom-overlay" onClick={() => setZoomImage(null)}>
          <img src={zoomImage} alt="zoom" className="zoom-image" />
        </div>
      )}
    </main>
  );
}

export default Home;